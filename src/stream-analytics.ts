import crossFetch from 'cross-fetch';

import * as errors from './errors';
import { validateEngagement, validateImpression, Impression, Engagement, Engagements } from './specs';

// use native fetch in browser mode to reduce bundle size
// webpack skip bundling the cross-fetch
const request = typeof crossFetch === 'function' ? crossFetch : window.fetch;

const pkg = require('../package.json'); // eslint-disable-line @typescript-eslint/no-var-requires

class StreamAnalytics<UserType = unknown> {
    static errors: typeof errors;

    baseUrl: string;
    apiKey: string;
    token: string;
    node: boolean;
    userData: UserType | null;

    constructor(config: { apiKey: string; token: string; baseUrl?: string }) {
        if (!config || !config.apiKey || !config.token) {
            throw new errors.MisconfiguredClient('the client must be initialized with apiKey and token');
        }

        this.userData = null;

        this.apiKey = config.apiKey;
        this.token = config.token;

        this.baseUrl = config.baseUrl || 'https://analytics.stream-io-api.com/analytics/v1.0/';
        this.node = typeof window === 'undefined';
    }

    setUser(data: UserType) {
        this.userData = data;
    }

    userAgent() {
        return `stream-javascript-analytics-client-${this.node ? 'node' : 'browser'}-${pkg.version || 'unknown'}`;
    }

    _sendEvent(resource: string, eventData: Impression | Engagements) {
        if (this.userData === null) throw new errors.MissingUserId('userData was not set');

        let body;
        if (resource === 'impression') {
            body = { ...eventData, user_data: this.userData };
        } else {
            body = {
                content_list: (eventData as Engagements).content_list.map((e: Engagement) => ({
                    ...e,
                    user_data: this.userData,
                })),
            };
        }

        return request(`${this.baseUrl + resource}/?api_key=${this.apiKey}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-Stream-Client': this.userAgent(),
                'stream-auth-type': 'jwt',
                Authorization: this.token,
            },
        }).then((response) => {
            if (response.ok) return response.json();
            throw new errors.APIError(response.statusText);
        });
    }

    trackImpression(eventData: Impression) {
        const err = validateImpression(eventData);
        if (err) throw new errors.InvalidInputData('event data is not valid', err);

        return this._sendEvent('impression', eventData);
    }

    trackEngagement(eventData: Engagement) {
        const err = validateEngagement(eventData);
        if (err) throw new errors.InvalidInputData('event data is not valid', err);

        return this._sendEvent('engagement', { content_list: [eventData] });
    }

    trackEngagements(eventData: Engagements) {
        if (!eventData || !eventData.content_list) {
            throw new errors.InvalidInputData('event data is not valid', [
                'engagements should be an object with non-empty content_list',
            ]);
        }

        const events = eventData.content_list;
        for (let i = 0; i < events.length; i++) {
            const err = validateEngagement(events[i]);
            if (err)
                throw new errors.InvalidInputData(
                    'event data is not valid',
                    err.map((e) => `${i}: ${e}`)
                );
        }

        return this._sendEvent('engagement', eventData);
    }
}

StreamAnalytics.errors = errors;

export = StreamAnalytics;
