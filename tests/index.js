var expect = expect || require('expect.js');

var node = typeof process != "undefined";

if (node) {
    var Client = require('../src/client.js');
    var errors = require('../src/errors.js');
    var StreamAnalytics = require('../src/stream-analytics.js');
} else {
    var Client = StreamAnalytics.Client;
    var errors = StreamAnalytics.errors;
}

var misconfiguredClientError = function (e) {
  expect(e).to.be.a(errors.MisconfiguredClient);
};

var apiKey = 'szhmf34fz9bu';
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJncm9wIjoid3JpdGUiLCJ1c2VyX2lkIjoiKiIsInJlc291cmNlIjoiYW5hbHl0aWNzIn0.p-wwTwA5XBhR57nW8U1OHup_4-EB1493AImc3kw6090';

describe('StreamAnalytics', function () {

  it('should initialize a client', function (done) {
    var analytics = new StreamAnalytics({
        'apiKey': 'key',
        'token': 'token'
    });
    expect(analytics.client.apiKey).to.eql('key');
    expect(analytics.client.token).to.eql('token');
    expect(analytics.userId).to.eql(null);
    done();
  });

  it('should set user_id', function (done) {
    var analytics = new StreamAnalytics({
        'apiKey': 'key',
        'token': 'token'
    });
    expect(analytics.userId).to.eql(null);
    analytics.setUser('user_id');
    expect(analytics.userId).to.eql('user_id');
    done();
  });

  it('should break on impressions without foreign_ids', function () {
    var analytics = new StreamAnalytics({
        'apiKey': 'key',
        'token': 'token'
    });
    var impression = {};
    expect(function() {
        analytics.trackImpression(impression);
    }).to.throwException(function(exception) {
        expect(exception).to.be.a(errors.InvalidInputData);
    });
  });

  it('should break on engagements without labels', function () {
    var analytics = new StreamAnalytics({
        'apiKey': 'key',
        'token': 'token'
    });
    var engagement = {};
    expect(function() {
        analytics.trackEngagement(engagement);
    }).to.throwException(function(exception) {
        expect(exception).to.be.a(errors.InvalidInputData);
    });
  });

  it('should validate engagements with wrong features', function () {
    var analytics = new StreamAnalytics({
        'apiKey': 'key',
        'token': 'token'
    });
    var engagement = {
        'label':'messing_around',
        'features': 'asdasd'
    };
    expect(function() {
        analytics.trackEngagement(engagement);
    }).to.throwException(function(exception) {
        expect(exception).to.be.a(errors.InvalidInputData);
    });

    engagement = {
        'label':'messing_around',
        'features': [{'group': 'group', 'value': ''}]
    };
    expect(function() {
        analytics.trackEngagement(engagement);
    }).to.throwException(function(exception) {
        expect(exception).to.be.a(errors.InvalidInputData);
    });

  });

  it('should validate impressions with string foreign ids', function () {
    var analytics = new StreamAnalytics({
        'apiKey': 'key',
        'token': 'token'
    });
    var impression = {
        'foreign_ids':'messing_around'
    };

    expect(function() {
        analytics.trackImpression(impression);
    }).to.throwException(function(exception) {
        expect(exception).to.be.a(errors.InvalidInputData);
    });
  });

  it('should validate impressions with wrong features', function (done) {
    var analytics = new StreamAnalytics({
        'apiKey': 'key',
        'token': 'token'
    });
    var impression = {
        'foreign_ids':['messing_around'],
        'features': 'asdasd'
    };
    expect(function() {
        analytics.trackImpression(impression);
    }).to.throwException(function(exception) {
        expect(exception).to.be.a(errors.InvalidInputData);
    });
    impression = {
        'label':'messing_around',
        'features': [{'group': 'group', 'value': ''}]
    };
    expect(function() {
        analytics.trackImpression(impression);
    }).to.throwException(function(exception) {
        expect(exception).to.be.a(errors.InvalidInputData);
    });
    done();
  });

});


describe('analytics client', function () {

  it('should store apiKey and token', function (done) {
    var client = new Client({'apiKey': 'key', 'token': 'token'});
    expect(client.apiKey).to.eql('key');
    expect(client.token).to.eql('token');
    done();
  });

  it('should validate apiKey and token', function (done) {
    expect(function(){
        new Client({'apiKey': 'key'});
    }).to.throwException(misconfiguredClientError);
    expect(function(){
        new Client({'token': 'token'});
    }).to.throwException(misconfiguredClientError);
    expect(function(){
        new Client({});
    }).to.throwException(misconfiguredClientError);
    expect(function(){
        new Client();
    }).to.throwException(misconfiguredClientError);
    done();
  });

});


describe('analytics client integration', function () {
  this.timeout(5000);

  it('should store track impressions', function () {
    var analytics = new StreamAnalytics({'apiKey': apiKey, 'token': token});
    analytics.setUser('tommaso');
    analytics.trackImpression({
        'foreign_ids': ['1', 2, '3'],
        'features': [
            {'group':'topic', 'value':'js'},
            {'group':'user', 'value':'tommaso'}
        ]
    });
  });

  it('should store track engagements', function () {
    var analytics = new StreamAnalytics({'apiKey': apiKey, 'token': token});
    analytics.setUser('tommaso');
    analytics.trackEngagement({
        'foreign_id': '1',
        'label': 'click',
        'features': [
            {'group':'topic', 'value':'js'},
            {'group':'user', 'value':'tommaso'}
        ]
    });
  });

});
