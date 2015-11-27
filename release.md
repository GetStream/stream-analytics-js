Create a new version
```
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease]
```

Publish the new version on npm
```
npm publish
```

Publish the new version on CloudFront and promote as latest
```
AWS_KEY=<KEY> AWS_SECRET=<SECRET> gulp s3publish
```
