var expect = expect || require('expect.js');
var Client = require('../src/client.js');
var errors = require('../src/errors.js');
var StreamAnalytics = require('../src/stream-analytics.js');

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

  it('should break on impressions without foreign_ids', function (done) {
    var analytics = new StreamAnalytics({
        'apiKey': 'key',
        'token': 'token'
    });
    var impression = {};
    analytics.trackImpression(impression, function(errors) {
        expect(errors).to.not.be.empty();
        done();
    });
  });

  it('should break on engagements without labels', function (done) {
    var analytics = new StreamAnalytics({
        'apiKey': 'key',
        'token': 'token'
    });
    var engagement = {};
    analytics.trackEngagement(engagement, function(errors) {
        expect(errors).to.not.be.empty();
        done();
    });
  });

  it('should validate engagements with wrong features', function (done) {
    var analytics = new StreamAnalytics({
        'apiKey': 'key',
        'token': 'token'
    });
    var engagement = {
        'label':'messing_around',
        'features': 'asdasd'
    };
    analytics.trackEngagement(engagement, function(errors) {
        expect(errors).to.not.be.empty();
    });
    engagement = {
        'label':'messing_around',
        'features': [{'group': 'group', 'value': ''}]
    };
    analytics.trackEngagement(engagement, function(errors) {
        expect(errors).to.not.be.empty();
    });
    done();
  });

  it('should validate impressions with string foreign ids', function (done) {
    var analytics = new StreamAnalytics({
        'apiKey': 'key',
        'token': 'token'
    });
    var impression = {
        'foreign_ids':'messing_around'
    };
    analytics.trackImpression(impression, function(errors) {
        expect(errors).to.not.be.empty();
    });
    done();
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
    analytics.trackImpression(impression, function(errors) {
        expect(errors).to.not.be.empty();
    });
    impression = {
        'label':'messing_around',
        'features': [{'group': 'group', 'value': ''}]
    };
    analytics.trackImpression(impression, function(errors) {
        expect(errors).to.not.be.empty();
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

  it('should store track impressions', function (done) {
    var analytics = new StreamAnalytics({'apiKey': apiKey, 'token': token});
    analytics.setUser('tommaso');
    analytics.trackImpression({
        'foreign_ids': ['1', 2, '3'],
        'features': [
            {'group':'topic', 'value':'js'},
            {'group':'user', 'value':'tommaso'}
        ]
    }, function(error, response, body) {
        done();
        expect(response.statusCode).to.eql(201);
    });
  });

  it('should store track engagements', function (done) {
    var analytics = new StreamAnalytics({'apiKey': apiKey, 'token': token});
    analytics.setUser('tommaso');
    analytics.trackEngagement({
        'label': 'click',
        'features': [
            {'group':'topic', 'value':'js'},
            {'group':'user', 'value':'tommaso'}
        ]
    }, function(error, response, body) {
        done();
        expect(response.statusCode).to.eql(201);
    });
  });

});
