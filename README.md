# ffetch

Simple thin fetch wrapper. `ffetch` means more human **F**riendly **FETCH**.

[![npm version](https://badge.fury.io/js/ffetch.svg)](http://badge.fury.io/js/ffetch)
[![Circle CI](https://circleci.com/gh/axross/ffetch/tree/stable.svg?style=svg&circle-token=4ebcc03d8e89eec153012626ccb181ec2986ac64)](https://circleci.com/gh/axross/ffetch/tree/stable)
[![Circle CI](https://circleci.com/gh/axross/ffetch/tree/master.svg?style=svg&circle-token=4ebcc03d8e89eec153012626ccb181ec2986ac64)](https://circleci.com/gh/axross/ffetch/tree/master)

## Example

```javascript
import ffetch from 'ffetch';

// fetch from GET /path/to/api/page/3?q=github&order=id
ffetch.get('/path/to/api/page/:page', {
  params: { page: 3 },
  queries: { q: 'github', order: 'id' },
})
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));
```

```javascript
import { FFetch } from 'ffetch';

// create your ffetch instance with config
const ffetch = new FFetch({
  baseUrl: 'http://your.web.api/v2',
  headers: {
    'X-Auth-Token': '123456789ABCDEF0',
  },
});

// send JSON payload to PUT http://your.web.api/v2/path/to/api
ffetch.put('/path/to/api', {
  body: {
    title: 'json payload',
    text: 'it will be stringified',
  },
})
  .then(res => console.log(res));
```

## Requirement

- `global.Promise()`

ffetch works on both of the Browser and the Node.js but It needs Promise API.

## Usage

#### Working on the Browser:

```javascript
// Promise() polyfill
import { Promise } from 'es6-promise';

window.Promise = Promise;
```

Then, use directly:

```javascript
import ffetch from 'ffetch';
import fetch from 'whatwg-fetch';  // just a polyfill

// call fetch() friendly
ffetch.get(/* ... */)
  .then(res => /* ... */)
  .catch(err => /* ... */);
```

Or use your instance with options:

```javascript
import { FFetch } from 'ffetch';

const ffetch = new FFetch({
  fetch: () => { /* your custom fetch function */ },
});

// call fetch() friendly
ffetch.get(/* ... */)
  .then(res => /* ... */)
  .catch(err => /* ... */);
```

#### Working on the Node.js:

```javascript
import { Promise } from 'es6-promise';
import nodeFetch from 'node-fetch';
import { FFetch } from 'ffetch';

const ffetch = new FFetch({
  fetch: nodeFetch,
});

// call fetch() friendly
ffetch.get(/* ... */)
  .then(res => /* ... */)
  .catch(err => /* ... */);
```

## API

### ffetch.get(url: string [, options: object]): Promise<Response>
### ffetch.post()
### ffetch.put()
### ffetch.del()
### ffetch.head()
### ffetch.opt()

Call `fetch()` like human friendly.

```javascript
ffetch.get('/path/to/api/page/:page', {
  param: { page: 3 },
  query: { q: 'github', order: 'id' },
})
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));
```

|argument         |type  |                                                     |
|:--------------- |:---- |:--------------------------------------------------- |
|`url`            |string|URL of request.                                      |
|`options.param`  |object|URL parameters.                                      |
|`options.query`  |object|URL queries.                                         |
|`options.header` |object|Request headers.                                     |
|`options.body`   |      |Request body. If it is an object or an array, It will be a string by `JSON.stringify()`.|
|`options.timeout`|number|If request exceeded this value, `ffetch()` throws an error(promisified).|
|`options.***`    |      |Some other options.                                  |

### new FFetch([options])

Create an instance for fetching.

```javascript

import fetch from 'node-fetch';

const ffetch = new FFetch({
  baseUrl: 'http://your.web.api/v2',
  headers: {
    'X-Auth-Token': '123456789ABCDEF0',
  },
  timeout: 30000,
  fetch,
});
```

|argument         |type    |                                                   |
|:--------------- |:------ |:------------------------------------------------- |
|`options.baseUrl`|string  |URL prefix of each request.                        |
|`options.headers`|object  |Request headers. it will merge to each request.    |
|`options.timeout`|number  |the default of `options.timeout` of such as `ffetch.get()`.|
|`options.fetch`  |function|Custom request function. default: '(global).fetch' |
