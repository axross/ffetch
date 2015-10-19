# ffetch

Simple thin fetch wrapper.

[![npm version](https://badge.fury.io/js/ffetch.svg)](http://badge.fury.io/js/ffetch)
[![Circle CI](https://circleci.com/gh/axross/ffetch/tree/stable.svg?style=svg&circle-token=4ebcc03d8e89eec153012626ccb181ec2986ac64)](https://circleci.com/gh/axross/ffetch/tree/stable)
[![Circle CI](https://circleci.com/gh/axross/ffetch/tree/master.svg?style=svg&circle-token=4ebcc03d8e89eec153012626ccb181ec2986ac64)](https://circleci.com/gh/axross/ffetch/tree/master)

## Example

```javascript
import ffetch from 'ffetch';

//
// fetch from GET /path/to/api/page/3?q=github&order=id
//
ffetch.get('/path/to/api/page/:page', {
  param: { page: 3 },
  query: { q: 'github', order: 'id' },
})
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));

//
// send JSON payload to PUT /path/to/api
//
ffetch.put('/path/to/api', {
  body: {
    title: 'json payload',
    text: 'it will be stringified',
  },
})
  .then(res => console.log(res));
```

## Requirement

- `global.fetch()`

ffetch works on both of the Browser and the Node.js.

on the Browser:

```javascript
// fetch() polyfill
require('whatwg-fetch');
```

on the Node.js:

```javascript
global.fetch = require('node-fetch');
```

## API

### ffetch.get(url: string [, options: object]): Promise<Response>
### ffetch.post()
### ffetch.put()
### ffetch.del()
### ffetch.head()
### ffetch.opt()

Call `fetch()`.

```javascript
ffetch.get('/path/to/api/page/:page', {
  param: { page: 3 },
  query: { q: 'github', order: 'id' },
})
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));
```

|argument        |type  |                                                      |
|:-------------- |:---- |:---------------------------------------------------- |
|`url`           |string|URL of request.                                       |
|`options.param` |object|URL parameters.                                       |
|`options.query` |object|URL queries.                                          |
|`options.header`|object|Request headers.                                      |
|`options.body`  |      |Request body. If it is an object or an array, It will be a string by `JSON.stringify()`.|
|`options.***`   |      |Some other options.                                   |
