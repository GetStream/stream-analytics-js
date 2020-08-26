import crossFetch from 'cross-fetch';

import * as errors from './errors';
import { validateEngagement, validateImpression, Impression, Engagement } from './specs';

// use native fetch in browser mode to reduce bundle size
// webpack skip bundling the cross-fetch
const request = typeof crossFetch === 'function' ? crossFetch : window.fetch;

class StreamAnalytics<UserType = unknown> {
    static errors: typeof errors;

    baseUrl: string;
    apiKey: string;
    token: string;
    node: boolean;
    userData: UserType | null;

    constructor(config: { apiKey: string; token: string }) {
        if (!config || !config.apiKey || !config.token) {
            throw new errors.MisconfiguredClient('the client must be initialized with apiKey and token');
        }

        this.userData = null;

        this.apiKey = config.apiKey;
        this.token = config.token;

        this.baseUrl = 'https://analytics.stream-io-api.com/analytics/v1.0/';
        this.node = typeof window === 'undefined';
    }

    setUser(data: UserType) {
        this.userData = data;
    }

    _sendEvent(resource: string, eventData: Impression | Engagement) {
        if (this.userData === null) throw new errors.MissingUserId('userData was not set');

        return request(`${this.baseUrl + resource}/?api_key=${this.apiKey}`, {
            method: 'POST',
            body: JSON.stringify({ ...eventData, user_data: this.userData }),
            headers: {
                'Content-Type': 'application/json',
                'X-Stream-Client': `stream-javascript-client-${this.node ? 'node' : 'browser'}`,
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

        return this._sendEvent('engagement', eventData);
    }
}

StreamAnalytics.errors = errors;

export = StreamAnalytics;
