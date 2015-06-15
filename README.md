# [WIP] EasyAgent

[![Circle CI](https://circleci.com/gh/axross/easyagent.svg?style=svg)](https://circleci.com/gh/axross/easyagent)

EasyAgent is nothing more than a wrapper library of [fetch API](https://fetch.spec.whatwg.org/), but EasyAgent certainly helps your using fetch API. Anyhow, view [examples](#examples) and [docs](#installation).

## Features

- Simple APIs resembling the [visionmedia/superagent](https://github.com/visionmedia/superagent).
- Returns Promise through from [fetch API](https://fetch.spec.whatwg.org/).
- Extend with plugin.
- Immutable setters.
- It can run on client-side and Node.js.

## Example

```javascript
import EasyAgent from 'easyagent';

EasyAgent.get('https://api.github.com/search/repositories')
  .setQueries({ q: 'easyagent' })  // append "?q=easyagent"  to url
  .fetchJSON()                     // returns promise
  .then(json => {
    console.log(json);
  })
  .catch(err => {
    console.error(err);
  });
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
