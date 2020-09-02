var expect = expect || require('expect.js');

var node = typeof process != 'undefined';

var errors;
if (node) {
    pkg = require('../package.json');
    errors = require('../lib/errors');
    var StreamAnalytics = require('../lib/stream-analytics');
} else {
    errors = StreamAnalytics.errors;
}

var misconfiguredClientError = function (e) {
    expect(e).to.be.a(errors.MisconfiguredClient);
};

var apiKey = 'szhmf34fz9bu';
var token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6ImFuYWx5dGljcyIsImFjdGlvbiI6IioiLCJ1c2VyX2lkIjoiKiJ9.yl6rNj_FckORWvGZBmLVLyrlJMFn6pl26AF0n5N1qrQ';

describe('StreamAnalytics', function () {
    it('should initialize a StreamAnalytics', function (done) {
        var analytics = new StreamAnalytics({
            apiKey: 'key',
            token: 'token',
        });
        expect(analytics.apiKey).to.eql('key');
        expect(analytics.token).to.eql('token');
        expect(analytics.userData).to.eql(null);
        done();
    });

    it('should have proper userAgent', function (done) {
        var analytics = new StreamAnalytics({ apiKey: 'key', token: 'token' });
        expect(analytics.userAgent()).to.eql(
            'stream-javascript-analytics-client-' + (node ? 'node' : 'browser') + '-' + pkg.version
        );
        done();
    });

    it('should set user_data', function (done) {
        var analytics = new StreamAnalytics({
            apiKey: 'key',
            token: 'token',
        });
        expect(analytics.userData).to.eql(null);
        analytics.setUser('user_data');
        expect(analytics.userData).to.eql('user_data');
        done();
    });

    it('should break on impressions without content_list', function () {
        var analytics = new StreamAnalytics({
            apiKey: 'key',
            token: 'token',
        });
        var impression = {};
        expect(function () {
            analytics.trackImpression(impression);
        }).to.throwException(function (exception) {
            expect(exception).to.be.a(errors.InvalidInputData);
        });
    });

    it('should break on engagements without labels', function () {
        var analytics = new StreamAnalytics({
            apiKey: 'key',
            token: 'token',
        });
        var engagement = {};
        expect(function () {
            analytics.trackEngagement(engagement);
        }).to.throwException(function (exception) {
            expect(exception).to.be.a(errors.InvalidInputData);
        });
    });

    it('should validate engagements with wrong features', function () {
        var analytics = new StreamAnalytics({
            apiKey: 'key',
            token: 'token',
        });
        var engagement = {
            label: 'messing_around',
            features: 'asdasd',
        };
        expect(function () {
            analytics.trackEngagement(engagement);
        }).to.throwException(function (exception) {
            expect(exception).to.be.a(errors.InvalidInputData);
        });

        engagement = {
            label: 'messing_around',
            features: [{ group: 'group', value: '' }],
        };
        expect(function () {
            analytics.trackEngagement(engagement);
        }).to.throwException(function (exception) {
            expect(exception).to.be.a(errors.InvalidInputData);
        });
    });

    it('should validate impressions with string foreign ids', function () {
        var analytics = new StreamAnalytics({
            apiKey: 'key',
            token: 'token',
        });
        var impression = {
            foreign_ids: 'messing_around',
        };

        expect(function () {
            analytics.trackImpression(impression);
        }).to.throwException(function (exception) {
            expect(exception).to.be.a(errors.InvalidInputData);
        });
    });

    it('should validate impressions with wrong features', function (done) {
        var analytics = new StreamAnalytics({
            apiKey: 'key',
            token: 'token',
        });
        var impression = {
            content_list: ['messing_around'],
            features: 'asdasd',
        };
        expect(function () {
            analytics.trackImpression(impression);
        }).to.throwException(function (exception) {
            expect(exception).to.be.a(errors.InvalidInputData);
        });
        impression = {
            label: 'messing_around',
            features: [{ group: 'group', value: '' }],
        };
        expect(function () {
            analytics.trackImpression(impression);
        }).to.throwException(function (exception) {
            expect(exception).to.be.a(errors.InvalidInputData);
        });
        done();
    });
});

describe('analytics client', function () {
    it('should store apiKey and token', function (done) {
        var client = new StreamAnalytics({ apiKey: 'key', token: 'token' });
        expect(client.apiKey).to.eql('key');
        expect(client.token).to.eql('token');
        done();
    });

    it('should validate apiKey and token', function (done) {
        expect(function () {
            new StreamAnalytics({ apiKey: 'key' });
        }).to.throwException(misconfiguredClientError);
        expect(function () {
            new StreamAnalytics({ token: 'token' });
        }).to.throwException(misconfiguredClientError);
        expect(function () {
            new StreamAnalytics({});
        }).to.throwException(misconfiguredClientError);
        expect(function () {
            new StreamAnalytics();
        }).to.throwException(misconfiguredClientError);
        done();
    });
});

describe('analytics client integration', function () {
    this.timeout(5000);

    it('should store code example #1', function () {
        var client = new StreamAnalytics({ apiKey: apiKey, token: token });
        client.setUser({ id: 486892, alias: 'Julian' });
        var impression = {
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
        var client = new StreamAnalytics({ apiKey: apiKey, token: token });
        client.setUser({ id: 486892, alias: 'Julian' });
        var engagement = {
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
        var client = new StreamAnalytics({ apiKey: apiKey, token: token });
        client.setUser({ id: 486892, alias: 'Julian' });
        var features = [
            {
                group: 'gener',
                value: 'latin-pop',
            },
        ];

        var engagement = {
            label: 'click',
            content: 'song:34349698',
            feed_id: 'playlist:Thierry',
            features: features,
        };

        return client.trackEngagement(engagement);
    });

    it('should store code example #4', function () {
        var client = new StreamAnalytics({ apiKey: apiKey, token: token });
        client.setUser({ id: 486892, alias: 'Julian' });
        var features = [
            {
                group: 'genre',
                value: 'latin-pop',
            },
        ];

        var impression = {
            content_list: ['song:34349698'],
            feed_id: 'user:thierry',
            features: features,
        };

        return client.trackImpression(impression);
    });

    it('should store code example #5', function () {
        var client = new StreamAnalytics({ apiKey: apiKey, token: token });
        client.setUser({ id: 486892, alias: 'Julian' });
        var engagement = {
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
        var client = new StreamAnalytics({ apiKey: apiKey, token: token });
        client.setUser({ id: 486892, alias: 'Julian' });
        var impression = {
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
        var client = new StreamAnalytics({ apiKey: apiKey, token: token });
        client.setUser({ id: 486892, alias: 'Julian' });
        var engagement = {
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
        var analytics = new StreamAnalytics({ apiKey: apiKey, token: token });
        analytics.setUser('tommaso');
        return analytics.trackImpression({
            content_list: ['1', '2', '3'],
            features: [
                { group: 'topic', value: 'js' },
                { group: 'user', value: 'tommaso' },
            ],
        });
    });

    it('should store track engagements', function () {
        var analytics = new StreamAnalytics({ apiKey: apiKey, token: token });
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
});
