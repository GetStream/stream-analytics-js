Get the library
-------------------

```bash
# via npm
$ npm install stream-analytics
```

Or load the library from our CDN:

```html
<script src="//d2j1fszo1axgmp.cloudfront.net/latest/stream-analytics.min.js" type="text/javascript"></script>
```

Configure an instance for your project
--------------------------------------
```js
var client = new StreamAnalytics({
  projectId: "YOUR_PROJECT_ID",
  writeKey: "YOUR_WRITE_KEY"
});
```

Set current user
----------------
```js
client.setUser('user:Thierry');
```

Track impressions
-----------------
Every activity (eg. messages) shown to the user should be tracked as an impression.

```js
var impression = {
    activityIds: ['message:34349698', 'message:34349699'],
    feedId: 'user:ChartMill'
};

// track impression for two messages presented to the user
client.trackImpression(impression);
```

Engagement tracking
-------------------

Every meaningful user interactions should be tracked with content (activity_id) and source (sourceFeedId) information and provide a label and a score (the score) for the engagement. score is a signed integer. Positive values boost source and content for the user that trigger the engagement, negative values work as a discount for the same context. The value of the score can be used to differentiate engagements according to their importants (eg. sharing a message is probably more important than just clicking it).

```js
engagement = {...}
// Sends one engagement event to the APIs
client.trackEngagement(engagement);

// Click on a message
var engagement = {
    label: 'click',
    score: 10,
    activityId: 'message:34349698',
    feedId: 'user:ChartMill',
};
client.trackEngagement(engagement);

// Share message
var engagement = {
    label: 'share',
    score: 100,
    activityId: 'message:34349698',
    feedId: 'user:ChartMill',
};
client.trackEngagement(engagement);
```

Update user data
----------------
this allows for storing extra information about the current user such as public profiles

```js
var userData = {
    twitterId: '15875029',
    facebookId: '784785430'
};
client.updateUserData(userData);
```
