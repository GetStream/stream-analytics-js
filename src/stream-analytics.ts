import * as errors from './errors';
import { Client, ClientConfig } from './client';
import { validateEngagement, validateImpression, Impression, Engagement } from './specs';

class StreamAnalytics<UserType = unknown> {
    static errors: typeof errors;
    static Client: typeof Client;
    client: Client;
    userData: UserType | null;

    constructor(config: ClientConfig) {
        this.client = new Client(config);
        this.userData = null;
    }

    setUser(data: UserType) {
        this.userData = data;
    }

    _sendEvent(resource: string, eventData: Impression | Engagement) {
        if (this.userData === null) throw new errors.MissingUserId('userData was not set');
        return this.client.send(resource, { ...eventData, user_data: this.userData });
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

StreamAnalytics.Client = Client;
StreamAnalytics.errors = errors;

export = StreamAnalytics;
