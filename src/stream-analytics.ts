import crossFetch from 'cross-fetch';

import * as errors from './errors';
import { validateEngagement, validateImpression, Impression, Engagement } from './specs';

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

    _throwMissingUserData(event: Impression | Engagement) {
        if (this.userData || event.user_data) return;
        throw new errors.MissingUserId(
            'user_data should be in each event or set the default with StreamAnalytics.setUser()'
        );
    }

    _sendEvent(resource: string, event: Impression[] | Engagement[]) {
        let body;
        if (resource === 'impression') {
            body = (event as Impression[]).map((e) => ({ ...e, user_data: e.user_data || this.userData }));
        } else {
            body = {
                content_list: (event as Engagement[]).map((e) => ({ ...e, user_data: e.user_data || this.userData })),
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

    trackImpression(eventData: Impression<UserType>) {
        return this.trackImpressions([eventData]);
    }

    trackImpressions(eventDataList: Impression<UserType>[]) {
        for (let i = 0; i < eventDataList.length; i++) {
            const event = eventDataList[i];
            const err = validateImpression(event);
            if (err) {
                throw new errors.InvalidInputData(
                    'event data is not valid',
                    err.map((e) => `${i}: ${e}`)
                );
            }
            this._throwMissingUserData(event);
        }
        return this._sendEvent('impression', eventDataList);
    }

    trackEngagement(eventData: Engagement<UserType>) {
        return this.trackEngagements([eventData]);
    }

    trackEngagements(eventDataList: Engagement<UserType>[]) {
        for (let i = 0; i < eventDataList.length; i++) {
            const event = eventDataList[i];
            const err = validateEngagement(event);
            if (err) {
                throw new errors.InvalidInputData(
                    'event data is not valid',
                    err.map((e) => `${i}: ${e}`)
                );
            }
            this._throwMissingUserData(event);
        }
        return this._sendEvent('engagement', eventDataList);
    }
}

StreamAnalytics.errors = errors;

export = StreamAnalytics;
