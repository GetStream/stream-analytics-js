var chai = chai || require('chai');
const expect = chai.expect;

const node = typeof process != 'undefined';

if (node) {
    require('dotenv').config();
    apiKey = process.env.STREAM_API_KEY;
    token = process.env.STREAM_ANALYTICS_TOKEN;
    baseUrl = process.env.STREAM_BASE_URL;

    version = require('../package.json').version;
    errors = require('../lib/errors');
    StreamAnalytics = require('../lib/stream-analytics');
} else {
    errors = StreamAnalytics.errors;
}

describe('StreamAnalytics', function () {
    it('should initialize a StreamAnalytics', async function () {
        const analytics = new StreamAnalytics({
            apiKey: 'key',
            token: 'token',
            baseUrl,
        });
        expect(analytics.apiKey).to.eql('key');
        expect(analytics.token).to.eql('token');
        expect(analytics.userData).to.eql(null);
    });

    it('should have proper userAgent', async function () {
        const analytics = new StreamAnalytics({ apiKey: 'key', token: 'token', baseUrl });
        expect(analytics.userAgent()).to.eql(
            'stream-javascript-analytics-client-' + (node ? 'node' : 'browser') + '-' + version
        );
    });

    it('should set user_data', async function () {
        const analytics = new StreamAnalytics({
            apiKey: 'key',
            token: 'token',
            baseUrl,
        });
        expect(analytics.userData).to.eql(null);
        analytics.setUser('user_data');
        expect(analytics.userData).to.eql('user_data');
    });

    it('should break on impressions without content_list', function () {
        const analytics = new StreamAnalytics({
            apiKey: 'key',
            token: 'token',
            baseUrl,
        });
        const impression = {};
        expect(() => analytics.trackImpression(impression)).to.throw(errors.InvalidInputData);
    });

    it('should break on engagements without labels', function () {
        const analytics = new StreamAnalytics({
            apiKey: 'key',
            token: 'token',
            baseUrl,
        });
        const engagement = {};
        expect(() => analytics.trackEngagement(engagement)).to.throw(errors.InvalidInputData);
    });

    it('should break on impression without user_data & default userData', function () {
        const analytics = new StreamAnalytics({ apiKey: 'key', token: 'token', baseUrl });
        const impression = { content_list: ['song:34349698'], feed_id: 'flat:tommaso', location: 'android-app' };
        expect(() => analytics.trackImpression(impression)).to.throw(errors.MissingUserId);
    });

    it('should break on engagement without user_data & default userData', function () {
        const analytics = new StreamAnalytics({ apiKey: 'key', token: 'token', baseUrl });
        const engagement = { content: '2', label: 'click', features: [{ group: 'topic', value: 'go' }] };
        expect(() => analytics.trackEngagement(engagement)).to.throw(errors.MissingUserId);
    });

    it('should break on engagements without user_data & default userData', function () {
        const analytics = new StreamAnalytics({ apiKey: 'key', token: 'token', baseUrl });
        const engagement = { content: '2', label: 'click', features: [{ group: 'topic', value: 'go' }] };
        expect(() => analytics.trackEngagements([engagement, engagement])).to.throw(errors.MissingUserId);
    });

    it('should validate engagements with wrong features', function () {
        const analytics = new StreamAnalytics({
            apiKey: 'key',
            token: 'token',
            baseUrl,
        });
        let engagement = {
            label: 'messing_around',
            features: 'asdasd',
        };
        expect(() => analytics.trackEngagement(engagement)).to.throw(errors.InvalidInputData);

        engagement = {
            label: 'messing_around',
            features: [{ group: 'group', value: '' }],
        };
        expect(() => analytics.trackEngagement(engagement)).to.throw(errors.InvalidInputData);
    });

    it('should validate impressions with string foreign ids', function () {
        const analytics = new StreamAnalytics({
            apiKey: 'key',
            token: 'token',
            baseUrl,
        });
        const impression = {
            foreign_ids: 'messing_around',
        };

        expect(() => analytics.trackImpression(impression)).to.throw(errors.InvalidInputData);
    });

    it('should validate impressions with wrong features', async function () {
        const analytics = new StreamAnalytics({
            apiKey: 'key',
            token: 'token',
            baseUrl,
        });
        let impression = {
            content_list: ['messing_around'],
            features: 'asdasd',
        };
        expect(() => analytics.trackImpression(impression)).to.throw(errors.InvalidInputData);
        impression = {
            label: 'messing_around',
            features: [{ group: 'group', value: '' }],
        };
        expect(() => analytics.trackImpression(impression)).to.throw(errors.InvalidInputData);
    });
});

describe('analytics client', function () {
    it('should store apiKey and token', async function () {
        const client = new StreamAnalytics({ apiKey: 'key', token: 'token', baseUrl });
        expect(client.apiKey).to.eql('key');
        expect(client.token).to.eql('token');
    });

    it('should validate apiKey and token', async function () {
        expect(() => new StreamAnalytics({ apiKey: 'key', baseUrl })).to.throw(errors.MisconfiguredClient);
        expect(() => new StreamAnalytics({ token: 'token', baseUrl })).to.throw(errors.MisconfiguredClient);
        expect(() => new StreamAnalytics({ baseUrl })).to.throw(errors.MisconfiguredClient);
        expect(() => new StreamAnalytics()).to.throw(errors.MisconfiguredClient);
    });
});

describe('analytics client integration', function () {
    this.timeout(5000);

    it('should store code example #1', function () {
        const client = new StreamAnalytics({ apiKey, token, baseUrl });
        client.setUser({ id: '486892', alias: 'Julian' });
        const impression = {
            // the list of content IDs displayed to the user
            content_list: ['song:34349698', 'song:34349699', 'song:34349697'],
            // (optional) the feed where this content is coming from
            feed_id: 'flat:tommaso',
            // (optional) the location in your app. ie email, profile page etc
            location: 'android-app',
        };

        // send the impression events
        return client.trackImpression(impression);
    });

    it('should store code example #2', function () {
        const client = new StreamAnalytics({ apiKey, token, baseUrl });
        client.setUser({ id: '486892', alias: 'Julian' });
        const engagement = {
            // the label for the engagement, ie click, retweet etc.
            label: 'click',
            // the ID of the content that the user clicked
            content: {
                foreign_id: 'message:34349698',
            },
            // (optional) the position in a list of activities
            position: 3,
            // (optional) boost, default is 1.
            boost: 2,
            // (optional) the feed the user is looking at
            feed_id: 'user:thierry',
            // (optional) the location in your app. ie email, profile page etc
            location: 'profile_page',
        };

        return client.trackEngagement(engagement);
    });

    it('should store code example #3', function () {
        const client = new StreamAnalytics({ apiKey, token, baseUrl });
        client.setUser({ id: '486892', alias: 'Julian' });
        const features = [
            {
                group: 'gener',
                value: 'latin-pop',
            },
        ];

        const engagement = {
            label: 'click',
            content: 'song:34349698',
            feed_id: 'playlist:Thierry',
            features: features,
        };

        return client.trackEngagement(engagement);
    });

    it('should store code example #4', function () {
        const client = new StreamAnalytics({ apiKey, token, baseUrl });
        client.setUser({ id: '486892', alias: 'Julian' });
        const features = [
            {
                group: 'genre',
                value: 'latin-pop',
            },
        ];

        const impression = {
            content_list: ['song:34349698'],
            feed_id: 'user:thierry',
            features: features,
        };

        return client.trackImpression(impression);
    });

    it('should store code example #5', function () {
        const client = new StreamAnalytics({ apiKey, token, baseUrl });
        client.setUser({ id: '486892', alias: 'Julian' });
        const engagement = {
            label: 'click',
            content: {
                foreign_id: 'post:42',
                actor: { id: 'user:2353540' },
                verb: 'share',
                object: { id: 'song:34349698' },
            },
            feed_id: 'timeline:tom',
        };
        return client.trackEngagement(engagement);
    });

    it('should store code example #6', function () {
        const client = new StreamAnalytics({ apiKey, token, baseUrl });
        client.setUser({ id: '486892', alias: 'Julian' });
        const impression = {
            content_list: [
                {
                    foreign_id: 'post:42',
                    actor: { id: 'user:2353540' },
                    verb: 'share',
                    object: { id: 'song:34349698' },
                },
            ],
            feed_id: 'timeline:tom',
        };

        return client.trackImpression(impression);
    });

    it('should store code example #7', function () {
        const client = new StreamAnalytics({ apiKey, token, baseUrl });
        client.setUser({ id: '486892', alias: 'Julian' });
        const engagement = {
            label: 'click',
            content: {
                foreign_id: 'post:42',
                label: 'Tom shared She wolf from Shakira',
                actor: {
                    id: 'user:2353540',
                    label: 'Tom',
                },
                verb: 'share',
                object: {
                    id: 'song:34349698',
                    label: 'She wolf',
                },
            },
            feed_id: 'timeline:tom',
        };
        return client.trackEngagement(engagement);
    });

    it('should store track impressions', function () {
        const analytics = new StreamAnalytics({ apiKey, token, baseUrl });
        analytics.setUser('tommaso');
        return analytics.trackImpression({
            content_list: ['1', '2', '3'],
            features: [
                { group: 'topic', value: 'js' },
                { group: 'user', value: 'tommaso' },
            ],
        });
    });

    it('should track multiple impressions', function () {
        const analytics = new StreamAnalytics({ apiKey, token, baseUrl });
        analytics.setUser('tommaso');
        return analytics.trackImpressions([
            {
                content_list: ['1', '2', '3'],
                features: [
                    { group: 'topic', value: 'js' },
                    { group: 'user', value: 'tommaso' },
                ],
                user_data: { id: 'tommaso', alias: 'tommaso' },
            },
            {
                content_list: ['2', '3', '5'],
                features: [{ group: 'topic', value: 'js' }],
                user_data: { id: '486892', alias: 'Julian' },
            },
        ]);
    });

    it('should store track engagements', function () {
        const analytics = new StreamAnalytics({ apiKey, token, baseUrl });
        analytics.setUser('tommaso');
        return analytics.trackEngagement({
            content: '1',
            label: 'click',
            features: [
                { group: 'topic', value: 'js' },
                { group: 'user', value: 'tommaso' },
            ],
        });
    });

    it('should store track multiple engagements', function () {
        const analytics = new StreamAnalytics({ apiKey, token, baseUrl });
        analytics.setUser('tommaso');
        return analytics.trackEngagements([
            {
                content: '1',
                label: 'click',
                features: [
                    { group: 'topic', value: 'js' },
                    { group: 'user', value: 'tommaso' },
                ],
            },
            {
                content: '2',
                label: 'click',
                features: [
                    { group: 'topic', value: 'go' },
                    { group: 'user', value: 'tommaso' },
                ],
            },
        ]);
    });

    it('should track single engagement with user_data', function () {
        const analytics = new StreamAnalytics({ apiKey, token, baseUrl });
        return analytics.trackEngagement({
            content: '1',
            label: 'click',
            features: [
                { group: 'topic', value: 'js' },
                { group: 'user', value: 'tommaso' },
            ],
            user_data: 'tommaso',
        });
    });

    it('should track multiple engagements with different user_data', function () {
        const analytics = new StreamAnalytics({ apiKey, token, baseUrl });
        return analytics.trackEngagements([
            {
                content: '1',
                label: 'click',
                features: [
                    { group: 'topic', value: 'js' },
                    { group: 'user', value: 'tommaso' },
                ],
                user_data: 'tommaso',
            },
            {
                content: '2',
                label: 'click',
                features: [
                    { group: 'topic', value: 'go' },
                    { group: 'user', value: 'tommaso' },
                ],
                user_data: { id: '486892', alias: 'Julian' },
            },
            {
                content: '3',
                label: 'click',
                features: [{ group: 'topic', value: 'go' }],
                user_data: { id: 'tommaso', alias: 'tommaso' },
            },
        ]);
    });

    it('should track impression with user_data', function () {
        const analytics = new StreamAnalytics({ apiKey, token, baseUrl });
        return analytics.trackImpression({
            content_list: ['1', '2', '3'],
            features: [
                { group: 'topic', value: 'js' },
                { group: 'user', value: 'tommaso' },
            ],
            user_data: { id: '486892', alias: 'Julian' },
        });
    });

    it('should track multiple impressions with different user_data', function () {
        const analytics = new StreamAnalytics({ apiKey, token, baseUrl });
        return analytics.trackImpressions([
            {
                content_list: ['1', '2', '3'],
                features: [
                    { group: 'topic', value: 'js' },
                    { group: 'user', value: 'tommaso' },
                ],
                user_data: { id: 'tommaso', alias: 'tommaso' },
            },
            {
                content_list: ['2', '3', '5'],
                features: [{ group: 'topic', value: 'js' }],
                user_data: { id: '486892', alias: 'Julian' },
            },
        ]);
    });

    it('should throw exception with wrong user_data and contain detail from API', async function () {
        const analytics = new StreamAnalytics({ apiKey, token, baseUrl });
        const impression = {
            content_list: ['1', '2', '3'],
            features: [{ group: 'topic', value: 'js' }],
            user_data: { id: '486892', alias: 123 },
        };

        try {
            await analytics.trackImpression(impression);
            throw new Error('API should have failed instead');
        } catch (err) {
            expect(() => {
                throw err;
            }).to.throw(errors.APIError, /user_data/);
        }
    });
});
