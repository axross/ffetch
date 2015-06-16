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
    .fetchJson();
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
    .fetchJson();
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

### EasyAgent.get(url, [options])
### EasyAgent.post(url, [options])
### EasyAgent.put(url, [options])
### EasyAgent.del(url, [options])
### EasyAgent.head(url, [options])
### EasyAgent.opt(url, [options])

returns instance of EasyAgent.

```javascript
const ea = EasyAgent.get('https://api.github.com/search/repositories');
// => instance of EasyAgent
```

#### EasyAgent#setUrl(url)
#### EasyAgent#setMethod(method)
#### EasyAgent#setHeaders(url)
#### EasyAgent#setQueries(url)
#### EasyAgent#setBody(body)
#### EasyAgent#setJson(url)
#### EasyAgent#setForm(url)

#### EasyAgent#fetch()
#### EasyAgent#fetchJson()
#### EasyAgent#fetchText()
#### EasyAgent#fetchHtml()

## License

MIT
