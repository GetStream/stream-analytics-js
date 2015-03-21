Get the library
-------------------

```bash
# via npm
$ npm install stream-analytics

# or bower
$ bower install stream-analytics
```

Or load the library from our CDN:

```
<script src="https://xxx.cloudfront.net/..." type="text/javascript"></script>
```

Configure an instance for your project
--------------------------------------
```js
var client = new StreamAnalytics({
  projectId: "YOUR_PROJECT_ID",
  writeKey: "YOUR_WRITE_KEY"
});
```

Track impressions
-----------------
Every activity (eg. messages) shown to the user should be tracked as an impression

```js
var impression = {
    viewerId: 'user:Thierry',
    activityId: 'message:34349698',
    feedId: 'user:ChartMill',
    timestamp: new Date().toISOString() // optional
};

// sends an impression to the APIs
client.trackImpression(impression);
// sends multilple impressions to the APIs in one request
client.trackImpressions(impressions);
```

Engagement tracking
-------------------

Every meaningful user interactions should be tracked with content (activity_id) and source (sourceFeedId) information and provide a label and a score (the modifier) for the engagement. modifier is a signed integer. Positive values boost source and content for the user that trigger the engagement, negative values work as a discount for the same context. The value of the modifier can be used to differentiate engagements according to their importants (eg. sharing a message is probably more important than just clicking it).

```js
engagement = {...}
// Sends one engagement event to the APIs
client.trackEngagementEvent(engagement);
// Sends multiple engagement events to the APIs in one request
client.trackEngagementEvents(engagements);

// Click on a message
var engagement = {
    engagement: {
        label: 'click',
        modifier: 10
    },
    userId: 'user:Thierry',
    activityId: 'message:34349698',
    sourceFeedId: 'user:ChartMill',
    timestamp: new Date().toISOString() // optional
};
client.trackEngagementEvent(engagement);

// Share message
var engagement = {
    engagement: {
        label: 'share',
        modifier: 100
    },
    userId: 'user:Thierry',
    activityId: 'message:34349698',
    feedId: 'user:ChartMill',
    timestamp: new Date().toISOString() // optional
};
client.trackEngagementEvent(engagement);
```

Update user data
----------------
this allows for storing extra information about users such as public profile IDs

```js
var userData = {
    userId: 'user:Thierry',
    twitterId: '15875029',
    facebookId: '784785430'
};
client.updateUserData(userData);
```
