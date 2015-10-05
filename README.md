## Get the library

Load the library asynchronously

```html
<script type="text/javascript">
!function(a,b){a("StreamAnalytics","//d2j1fszo1axgmp.cloudfront.net/2.0.0/stream-analytics.min.js",b)}(function(a,b,c){var d,e,f;c["_"+a]={},c[a]=function(b){c["_"+a].clients=c["_"+a].clients||{},c["_"+a].clients[b.projectId]=this,this._config=b},d=["setUser","trackImpression","trackEngagement"];for(var g=0;g<d.length;g++){var h=d[g],i=function(a){return function(){return this["_"+a]=this["_"+a]||[],this["_"+a].push(arguments),this}};c[a].prototype[h]=i(h)}e=document.createElement("script"),e.async=!0,e.src=b,f=document.getElementsByTagName("script")[0],f.parentNode.insertBefore(e,f)},this);
</script>
```

## Configure an instance for your project

```js
var client = new StreamAnalytics({
  apiKey: "API_KEY",
  token: "ANALYTICS_TOKEN"
});
```

## Set current user

```js
client.setUser('7b22b0b8-6bb0-11e5-9d70-feff819cdc9f');
```

## Track impressions

Every activity (eg. messages) shown to the user should be tracked as an impression.

```js
var impression = {
    foreign_ids: ['message:34349698'],
    feedId: 'user:ChartMill'
};

// track impression for two messages presented to the user
client.trackImpression(impression);
```

## Engagement tracking

Every meaningful user interactions should be tracked with a label, optional extra information can be tracked as well.

```js
engagement = {...}
// Sends one engagement event to the APIs
client.trackEngagement(engagement);

// Click on a message
var engagement = {
    label: 'click',
    foreignId: 'message:34349698',
    feedId: 'user:ChartMill'
};
client.trackEngagement(engagement, function(){console.log(arguments);});

// Share message
var engagement = {
    label: 'share',
    foreignId: 'message:34349698',
    feedId: 'user:ChartMill'
};
client.trackEngagement(engagement);
```

## Fields reference

### features 

If necessary, you can send additional information about the data involved or the specific event. The features field must be a list of feature objects. A feature object is made of two mandatory fields: "group" and "value"

eg.

```javascript
[{
    'group': 'topic',
    'value': 'coffee'
}]
```

### location 

A string representing the location of the content (eg. 'notification_feed')

### feed_id 

A string representing the origin feed for the content

### boost 

An integer that multiplies the score of the interaction (eg. 2 or -1)

### position 

When tracking interactions with content, it might be useful to provide the oridinal position (eg. 2)

### foreign_id

The ID for the content as you store that in your database (or/and on Stream's feeds) (eg. 'user:42') (engagement only)

### foreign_ids

An Array of foreign_ids (impressions only)

### label

The event identifier (eg. click, share, ...) this field is mandatory for every engagement event
