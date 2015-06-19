# [WIP] EasyAgent

[![Circle CI](https://circleci.com/gh/axross/easyagent.svg?style=svg)](https://circleci.com/gh/axross/easyagent)

EasyAgent is nothing more than a wrapper library of [Fetch API](https://fetch.spec.whatwg.org/), but EasyAgent certainly helps your using fetch API. Anyhow, view [examples](#examples) and [docs](#installation).

## Features

- Simple APIs.
- Immutable setters.
- Returns Promise from [Fetch API](https://fetch.spec.whatwg.org/).
- Workable in both client-side and Node.js.

## Example

```javascript
import EasyAgent from 'easyagent';

const baseAgent = EasyAgent
  .get('https://api.github.com/search/repositories')
  .setQueries({ page: 1 });

const currentAgent;

const search = query => {
  currentAgent = baseAgent.setQueries({ q: query });

  currentAgent
    .fetchJson()
    .then(json => {
      console.log(json);
    })
    .catch(err => {
      console.error(err);
    });
};

const fetchMore = () => {
  const page = currentAgent.queries.page;

  currentAgent = currentAgent.setQueries({ page: page + 1 });

  currentAgent
    .fetchJson()
    .then(json => {
      console.log(json);
    })
    .catch(err => {
      console.error(err);
    });
};
```

## Installation

```sh
$ npm i -S easyagent
```

```javascript
// in ES5
var EasyAgent = require('easyagent');

// in ES6
import EasyAgent from 'easyagent';
```

## API

### EasyAgent.get(urlString, [options])
### EasyAgent.post(urlString, [options])
### EasyAgent.put(urlString, [options])
### EasyAgent.del(urlString, [options])
### EasyAgent.head(urlString, [options])
### EasyAgent.opt(urlString, [options])

Create agent. It returns instance of EasyAgent.

```javascript
const ea = EasyAgent.get('https://api.github.com/search/repositories');
// => instance of EasyAgent
```

HTTP Method can change easily. use `ea.setMethod()`.

#### EasyAgent#setUrl(urlString)

Change the URL. It returns instance of EasyAgent but that is another reference than receiver.

```javascript
const ea = EasyAgent.get('https://api.github.com/search/repositories');

const another = ea.setUrl('https://api.github.com/users');

another;
// => instance of EasyAgent

ea.url;
// => "https://api.github.com/search/repositories"

another.url;
// => "https://api.github.com/users"
```

#### EasyAgent#setMethod(methodString)

Change the HTTP Request Method. It returns instance of EasyAgent but that is another reference than receiver.

```javascript
const ea = EasyAgent.get('https://api.github.com/search/repositories');

const another = ea.setMethod('POST');

another;
// => instance of EasyAgent

ea.method;
// => "GET"

another.method;
// => "POST"
```

#### EasyAgent#setHeaders(headersObject)

Append the HTTP Request Header. It returns instance of EasyAgent but that is another reference than receiver.

```javascript
const ea = EasyAgent.get('https://api.github.com/search/repositories');

const another = ea.setHeaders({ 'X-Custom-Header': 'abc' });
const anotherTwo = another.setHeaders({ 'X-User-Header': 'def' });

another;
// => instance of EasyAgent

ea.headers;
// => {}

another.headers;
// => { 'X-Custom-Header': 'abc' }

anotherTwo.headers;
// => { 'X-Custom-Header': 'abc', 'X-User-Header': 'def' }
```

#### EasyAgent#setQueries(queriesObject)

Append the URL Queries. It returns instance of EasyAgent but that is another reference than receiver.

```javascript
const ea = EasyAgent.get('https://api.github.com/search/repositories');

const another = ea.setQueries({ 'q': 'easyagent' });
const anotherTwo = another.setQueries({ 'page': 2 });

another;
// => instance of EasyAgent

ea.queries;
// => {}

another.queries;
// => { q: 'easyagent' }

anotherTwo.queries;
// => { q: 'easyagent', page: 2 }
```

#### EasyAgent#setBody(bodyString)

Set the HTTP Request Body. It returns instance of EasyAgent but that is another reference than receiver.

```javascript
const ea = EasyAgent.post('https://api.github.com/search/repositories');

const another = ea.setBody('body');

another;
// => instance of EasyAgent

ea.body;
// => null

another.body;
// => 'body'
```

#### EasyAgent#setJson(jsonObject)

Set the HTTP Request Body and Headers. This method append `Content-Type: application/json` to HTTP Request Headers. Body will convert to string by 'JSON.stringify()'. It returns instance of EasyAgent but that is another reference than receiver.

```javascript
const ea = EasyAgent.post('https://api.github.com/search/repositories');

const another = ea.setJson({ id: 3 });

another;
// => instance of EasyAgent

ea.body;
// => null

another.body;
// => "{"id":3}"

another.headers;
// => { 'Content-Type': 'application/json' }
```

#### EasyAgent#setForm(formData)

Set the HTTP Request Body and Headers. This method append `Content-Type: application/x-www-form-urlencoded` to HTTP Request Headers. Body expects a `Form` Object. It returns instance of EasyAgent but that is another reference than receiver.

```javascript
const ea   = EasyAgent.post('https://api.github.com/search/repositories');
const form = document.querySelector('form');

const another = ea.setForm(new FormData(form));

another;
// => instance of EasyAgent

ea.body;
// => null

another.body;
// => instance of FormData

another.headers;
// => { 'Content-Type': 'application/x-www-form-urlencoded' }
```

#### EasyAgent#fetch()

Send the HTTP Request. This method returns the same as `fetch()`.

```javascript
const ea = EasyAgent.get('https://api.github.com/search/repositories')
  .setHeaders({ 'Accept': 'application/json' })
  .setQueries({
    q:    'easyagent',
    page: 2,
  })
  .fetch()
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));
```

#### EasyAgent#fetchJson()

Send the HTTP Request. This method append `Accept: application/json` to HTTP Request Headers, and this method returns an object of thenable by `res.json()`.

```javascript
const ea = EasyAgent.get('https://api.github.com/search/repositories')
  .setQueries({
    q:    'easyagent',
    page: 2,
  })
  .fetchJson()
  .then(json => console.log(json))
  .catch(err => console.error(err));
```

#### EasyAgent#fetchText([mimeType = 'text/plain'])

Send the HTTP Request. This method append `Accept: text/plain` to HTTP Request Headers that value can changed by first argument. This method returns an object of thenable by `res.text()`.

## License

MIT
