import crossFetch from 'cross-fetch';
import { MisconfiguredClient, APIError } from './errors';

// use native fetch in browser mode to reduce bundle size
// webpack skip bundling the cross-fetch
const request = typeof crossFetch === 'function' ? crossFetch : window.fetch;

export type ClientConfig = {
    apiKey: string;
    token: string;
};

export class Client {
    baseUrl: string;
    apiKey: string;
    token: string;
    node: boolean;

    constructor(config: ClientConfig) {
        if (!config || !config.apiKey || !config.token) {
            throw new MisconfiguredClient('the client must be initialized with apiKey and token');
        }

        this.apiKey = config.apiKey;
        this.token = config.token;

        this.baseUrl = 'https://analytics.stream-io-api.com/analytics/v1.0/';
        this.node = typeof window === 'undefined';
    }

    send(resource: string, eventData: unknown) {
        return request(`${this.baseUrl + resource}/?api_key=${this.apiKey}`, {
            method: 'POST',
            body: JSON.stringify(eventData),
            headers: {
                'Content-Type': 'application/json',
                'X-Stream-Client': `stream-javascript-client-${this.node ? 'node' : 'browser'}`,
                'stream-auth-type': 'jwt',
                Authorization: this.token,
            },
        }).then((response) => {
            if (response.ok) return response.json();
            throw new APIError(response.statusText);
        });
    }
}
