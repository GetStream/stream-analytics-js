import crossFetch from 'cross-fetch';

import * as errors from './errors';
import { validateEngagement, validateImpression, Impression, Engagement, User } from './specs';

// use native fetch in browser mode to reduce bundle size
// webpack skip bundling the cross-fetch
const request = typeof crossFetch === 'function' ? crossFetch : window.fetch;

const pkg = require('../package.json'); // eslint-disable-line @typescript-eslint/no-var-requires

class StreamAnalytics<UserType extends User = User> {
    static errors: typeof errors;

    baseUrl: string;
    apiKey: string;
    token: string;
    node: boolean;
    userData: null | string | UserType;

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

    setUser(data: string | UserType) {
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

    _validateAndNormalizeUserData(resource: string, eventList: Array<Impression | Engagement>) {
        return eventList.map((event, i) => {
            const err =
                resource === 'impression'
                    ? validateImpression(event as Impression)
                    : validateEngagement(event as Engagement);
            if (err) throw new errors.InvalidInputData('invalid event data', i ? err.map((e) => `${i}: ${e}`) : err);

            this._throwMissingUserData(event);

            return { ...event, user_data: event.user_data || this.userData };
        });
    }

    _sendEvent(resource: string, eventList: Impression[] | Engagement[]) {
        const events = this._validateAndNormalizeUserData(resource, eventList);

        return request(`${this.baseUrl + resource}/?api_key=${this.apiKey}`, {
            method: 'POST',
            body: JSON.stringify(resource === 'impression' ? events : { content_list: events }),
            headers: {
                'Content-Type': 'application/json',
                'X-Stream-Client': this.userAgent(),
                'stream-auth-type': 'jwt',
                Authorization: this.token,
            },
        }).then((response) => {
            if (response.ok) return response.json();
            return response.json().then((data) => {
                if (data.detail) throw new errors.APIError(`${response.statusText}: ${data.detail}`, response);
                throw new errors.APIError(response.statusText, response);
            });
        });
    }

    trackImpression(eventData: Impression<UserType>) {
        return this.trackImpressions([eventData]);
    }

    trackImpressions(eventDataList: Impression<UserType>[]) {
        return this._sendEvent('impression', eventDataList);
    }

    trackEngagement(eventData: Engagement<UserType>) {
        return this.trackEngagements([eventData]);
    }

    trackEngagements(eventDataList: Engagement<UserType>[]) {
        return this._sendEvent('engagement', eventDataList);
    }
}

StreamAnalytics.errors = errors;

export = StreamAnalytics;
