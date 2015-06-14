# [WIP] EasyAgent

EasyAgent is nothing more than a wrapper library of [fetch API](https://fetch.spec.whatwg.org/), but EasyAgent certainly helps your using fetch API. Anyhow, view [examples](#examples) and [docs](#installation).

## Features

- Simple APIs resembling the [visionmedia/superagent](https://github.com/visionmedia/superagent).
- Returns Promise through from [fetch API](https://fetch.spec.whatwg.org/).
- Extend with plugin.
- Immutable setters.
- It can run on client-side and Node.js.

## Example

```javascript
import request from 'easyagent';

request.get('https://api.github.com/search/repositories')
  .setQueries({ q: 'easyagent' })
  .getJSON()
  .then(json => {
    console.log(json);
  })
  .catch(err => {
    console.error(err);
  });
```

## Installation

```
$ npm i -S easyagent
```

```javascript
// in ES5
var request = require('easyagent');

// in ES6
import request from 'easyagent';
```

## API

### request.get(url, [options])
### request.post(url, [options])
### request.put(url, [options])
### request.del(url, [options])
### request.head(url, [options])
### request.opt(url, [options])

returns instance of EasyAgent.

```javascript
const ea = request.get('https://api.github.com/search/repositories');
// => instance of EasyAgent
```

#### ea.setUrl(url)
#### ea.setMethod(method)
#### ea.setHeaders(url)
#### ea.setBody(body)
#### ea.setJSONBody(url)
#### ea.setFormBody(url)
#### ea.setQueries(url)
#### ea.setOptions(options)

#### ea.fetchResponse()
#### ea.fetchJSON()
#### ea.fetchText()
#### ea.fetchHTML()

#### ea.use(plugin)

### request.globalUse(plugin)
### request.globalUnuse(plugin)
### request.globalUnuseAll()

## License

MIT
