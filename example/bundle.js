(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var globalPlugins = [];

var fetch = function fetch() {
  throw new ReferenceError('fetch is not defined');
};

if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
  fetch = window.fetch;
}

var EasyAgent = (function () {
  function EasyAgent(url) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, EasyAgent);

    this.url = url;
    this.method = options.method || 'GET';
    this.queries = options.queries || {};
    this.headers = options.headers || {};
    this.body = options.body || null;
    this.plugins = options.plugins || globalPlugins;
  }

  _createClass(EasyAgent, [{
    key: 'setUrl',
    value: function setUrl(newUrl) {
      return new this.constructor(newUrl, this.options);
    }
  }, {
    key: 'setOptions',
    value: function setOptions(newOptions) {
      var options = _util2['default'].assign(Object(this), newOptions);
      var method = options.method.toUpperCase();
      var body = options.body;

      if (body !== null && (method === 'GET' || method === 'HEAD')) {
        throw new TypeError('Body not allowed for GET or HEAD requests');
      }

      return new this.constructor(this.url, options);
    }
  }, {
    key: 'setMethod',
    value: function setMethod(method) {
      return this.setOptions({ method: method });
    }
  }, {
    key: 'setHeaders',
    value: function setHeaders(headers) {
      return this.setOptions({ headers: _util2['default'].assign(this.headers, headers) });
    }
  }, {
    key: 'setBody',
    value: function setBody(body) {
      return this.setOptions({ body: body });
    }
  }, {
    key: 'setJson',
    value: function setJson(json) {
      var jsonStr = JSON.stringify(json);

      return this.setOptions({
        body: jsonStr,
        headers: _util2['default'].assign(this.headers, {
          'Content-Type': 'application/json'
        })
      });
    }
  }, {
    key: 'setForm',
    value: function setForm(form) {
      return this.setOptions({
        body: form,
        headers: _util2['default'].assign(this.headers, {
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      });
    }
  }, {
    key: 'setQueries',
    value: function setQueries(queries) {
      return this.setOptions({ queries: _util2['default'].assign(this.queries, queries) });
    }
  }, {
    key: 'use',
    value: function use(plugin) {
      return this.setOptions({ plugins: this.plugins.concat([plugin]) });
    }
  }, {
    key: 'fetchResponse',
    value: function fetchResponse() {
      var queryString = _util2['default'].queryString(this.queries);

      var f = fetch(this.url + queryString, {
        method: this.method,
        headers: this.hearders,
        body: this.body
      });

      if (this.plugins.length > 0) {
        f = this.plugins.reduce(function (__f, plugin) {
          return plugin(__f).call(__f);
        }, f);
      }

      return f;
    }
  }, {
    key: 'fetchJson',
    value: function fetchJson() {
      return this.setHeaders({ 'Accept': 'application/json' }).fetchResponse().then(function (res) {
        return res.json();
      });
    }
  }, {
    key: 'fetchText',
    value: function fetchText() {
      var mimeType = arguments[0] === undefined ? 'text/plain' : arguments[0];

      return this.setHeaders({ 'Accept': mimeType }).fetchResponse().then(function (res) {
        return res.text();
      });
    }
  }, {
    key: 'fetchHtml',
    value: function fetchHtml() {
      return this.fetchText('text/html');
    }
  }], [{
    key: 'get',
    value: function get(url, options) {
      return new this(url, _util2['default'].assign({ method: 'GET', body: null }, options));
    }
  }, {
    key: 'post',
    value: function post(url, options) {
      return new this(url, _util2['default'].assign({ method: 'POST', body: null }, options));
    }
  }, {
    key: 'put',
    value: function put(url, options) {
      return new this(url, _util2['default'].assign({ method: 'PUT', body: null }, options));
    }
  }, {
    key: 'del',
    value: function del(url, options) {
      return new this(url, _util2['default'].assign({ method: 'DELETE', body: null }, options));
    }
  }, {
    key: 'head',
    value: function head(url, options) {
      return new this(url, _util2['default'].assign({ method: 'HEAD', body: null }, options));
    }
  }, {
    key: 'opt',
    value: function opt(url, options) {
      return new this(url, _util2['default'].assign({ method: 'OPTIONS', body: null }, options));
    }
  }, {
    key: 'setFetchFunction',
    value: function setFetchFunction(anotherFetch) {
      fetch = anotherFetch;
    }
  }, {
    key: 'use',
    value: function use(plugin) {
      globalPlugins.push(plugin);
    }
  }, {
    key: 'unuse',
    value: function unuse(plugin) {
      var index = globalPlugins.indexOf(plugin);

      if (index < 0) return false;

      globalPlugins.splice(index, 1);
    }
  }, {
    key: 'unuseAll',
    value: function unuseAll() {
      globalPlugins.splice(0, globalPlugins.length);
    }
  }]);

  return EasyAgent;
})();

;

exports['default'] = EasyAgent;
module.exports = exports['default'];
},{"./util":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var queryString = function queryString(obj) {
  var keys = Object.keys(obj);

  if (keys.length === 0) return '';

  var pairs = keys.map(function (key) {
    return '' + encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
  });

  return '?' + pairs.join('&');
};

exports['default'] = {
  assign: _objectAssign2['default'],
  queryString: queryString
};
module.exports = exports['default'];
},{"object-assign":4}],3:[function(require,module,exports){
var EasyAgent = require('../dist/EasyAgent');

document.addEventListener('DOMContentLoaded', function() {
  var formEl   = document.querySelector('.form');
  var inputEl  = document.querySelector('.input');
  var resultEl = document.querySelector('.result');

  var outputResult = function(repos) {
    var fragment = document.createDocumentFragment();

    var template = document.createElement('li');
    template.appendChild(document.createElement('a'));
    template.appendChild(document.createElement('span'));

    while (resultEl.children.length > 0) {
      resultEl.removeChild(resultEl.firstChild);
    }

    repos.forEach(function(repo) {
      var node   = template.cloneNode(true);
      var aEl    = node.querySelector('a');
      var spanEl = node.querySelector('span');

      console.log(node);

      aEl.textContent = repo.full_name;
      aEl.setAttribute('href', repo.url);

      spanEl.textContent = '(' + repo.stargazers_count + ')'

      fragment.appendChild(node);
    });

    resultEl.appendChild(fragment);
  };

  formEl.addEventListener('submit', function(e) {
    e.preventDefault();

    var query = inputEl.value.trim();

    EasyAgent.get('https://api.github.com/search/repositories')
      .setQueries({ q: query })
      .fetchJson()
      .then(function(json) {
        outputResult(json.items);
      })
      .catch(function(err) {
        console.error(err);
      });
  });
});

},{"../dist/EasyAgent":1}],4:[function(require,module,exports){
'use strict';
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function ownEnumerableKeys(obj) {
	var keys = Object.getOwnPropertyNames(obj);

	if (Object.getOwnPropertySymbols) {
		keys = keys.concat(Object.getOwnPropertySymbols(obj));
	}

	return keys.filter(function (key) {
		return propIsEnumerable.call(obj, key);
	});
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = ownEnumerableKeys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}]},{},[3]);
