# [WIP] EasyAgent

EasyAgent is nothing more than a wrapper library of [fetch API](https://fetch.spec.whatwg.org/) but EasyAgent certainly helps your using fetch API. Anyhow, view a [examples](#examples) and [docs](#installation).

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
npm i -S easyagent
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
const easyagent = request.get('https://api.github.com/search/repositories');
// => instance of EasyAgent
```

#### easyagent.setUrl(url)
#### easyagent.setMethod(method)
#### easyagent.setHeaders(url)
#### easyagent.setBody(body)
#### easyagent.setJSONBody(url)
#### easyagent.setFormBody(url)
#### easyagent.setQueries(url)
#### easyagent.setOptions(options)

#### easyagent.getResponse()
#### easyagent.getJSON()
#### easyagent.getText()
#### easyagent.getHTML()

#### easyagent.use(plugin)

### request.globalUse(plugin)
### request.globalUnuse(plugin)
### request.globalUnuseAll()
