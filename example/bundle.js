(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _querify = require('./querify');

var _querify2 = _interopRequireDefault(_querify);

var _fetch = function fetch() {
  throw new ReferenceError('fetch is not defined');
};

if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
  _fetch = window.fetch;
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
  }

  _createClass(EasyAgent, [{
    key: '__setOptions',
    value: function __setOptions(options) {
      return new EasyAgent(this.url, (0, _objectAssign2['default'])({}, Object(this), options));
    }
  }, {
    key: 'setUrl',
    value: function setUrl(newUrl) {
      return new EasyAgent(newUrl, this.options);
    }
  }, {
    key: 'setMethod',
    value: function setMethod(method) {
      return this.__setOptions({ method: method });
    }
  }, {
    key: 'setHeaders',
    value: function setHeaders(headers) {
      return this.__setOptions({ headers: (0, _objectAssign2['default'])({}, this.headers, headers) });
    }
  }, {
    key: 'setQueries',
    value: function setQueries(queries) {
      return this.__setOptions({ queries: (0, _objectAssign2['default'])({}, this.queries, queries) });
    }
  }, {
    key: 'setBody',
    value: function setBody(body) {
      return this.__setOptions({ body: body });
    }
  }, {
    key: 'setJson',
    value: function setJson(json) {
      return this.__setOptions({
        body: JSON.stringify(json),
        headers: (0, _objectAssign2['default'])({}, this.headers, {
          'Content-Type': 'application/json'
        })
      });
    }
  }, {
    key: 'setForm',
    value: function setForm(form) {
      return this.__setOptions({
        body: form,
        headers: (0, _objectAssign2['default'])({}, this.headers, {
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      });
    }
  }, {
    key: 'fetch',
    value: function fetch() {
      var querified = (0, _querify2['default'])(this.queries);

      var f = _fetch(this.url + querified, {
        method: this.method,
        headers: this.headers,
        body: this.body
      });

      return f;
    }
  }, {
    key: 'fetchJson',
    value: function fetchJson() {
      return this.setHeaders({ 'Accept': 'application/json' }).fetch().then(function (res) {
        return res.json();
      });
    }
  }, {
    key: 'fetchText',
    value: function fetchText() {
      var mimeType = arguments[0] === undefined ? 'text/plain' : arguments[0];

      return this.setHeaders({ 'Accept': mimeType }).fetch().then(function (res) {
        return res.text();
      });
    }
  }], [{
    key: 'get',
    value: function get(url, options) {
      return new EasyAgent(url, (0, _objectAssign2['default'])({ method: 'GET', body: null }, options));
    }
  }, {
    key: 'post',
    value: function post(url, options) {
      return new EasyAgent(url, (0, _objectAssign2['default'])({ method: 'POST', body: null }, options));
    }
  }, {
    key: 'put',
    value: function put(url, options) {
      return new EasyAgent(url, (0, _objectAssign2['default'])({ method: 'PUT', body: null }, options));
    }
  }, {
    key: 'del',
    value: function del(url, options) {
      return new EasyAgent(url, (0, _objectAssign2['default'])({ method: 'DELETE', body: null }, options));
    }
  }, {
    key: 'head',
    value: function head(url, options) {
      return new EasyAgent(url, (0, _objectAssign2['default'])({ method: 'HEAD', body: null }, options));
    }
  }, {
    key: 'opt',
    value: function opt(url, options) {
      return new EasyAgent(url, (0, _objectAssign2['default'])({ method: 'OPTIONS', body: null }, options));
    }
  }, {
    key: 'setFetchFunction',
    value: function setFetchFunction(anotherFetch) {
      _fetch = anotherFetch;
    }
  }]);

  return EasyAgent;
})();

;

// TODO:
// EasyAgent.addCustomFetcher()

exports['default'] = EasyAgent;
module.exports = exports['default'];
},{"./querify":2,"object-assign":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var encode = function encode(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
};

var whenArray = function whenArray(key, arr) {
  return arr.map(function (value) {
    return '' + encode(key) + '[]=' + encode(value);
  }).join('&');
};

var whenObject = function whenObject(key, obj) {
  return Object.keys(obj).map(function (idx) {
    return '' + encode(key) + '[' + encode(idx) + ']=' + encode(obj[idx]);
  }).join('&');
};

var whenString = function whenString(key, str) {
  return '' + encode(key) + '=' + encode(str);
};

var querify = function querify(obj) {
  var keys = Object.keys(obj);

  if (keys.length === 0) return '';

  var pairs = keys.map(function (key) {
    var value = obj[key];

    if (Array.isArray(value)) {
      return whenArray(key, value);
    }
    if (Object.prototype.toString.call(value) === '[object Object]') {
      return whenObject(key, value);
    }

    return whenString(key, String(value));
  });

  return '?' + pairs.join('&');
};

exports['default'] = querify;
module.exports = exports['default'];
},{}],3:[function(require,module,exports){
var EasyAgent = require('../dist/EasyAgent');

document.addEventListener('DOMContentLoaded', function() {
  var baseAgent = EasyAgent
    .get('https://api.github.com/search/repositories')
    .setQueries({ page: 1 });

  var currentAgent;

  var formEl      = document.querySelector('.form');
  var inputEl     = document.querySelector('.input');
  var resultEl    = document.querySelector('.result');
  var fetchMoreEl = document.querySelector('.fetchMore');

  var templateEl = document.createElement('li');
  templateEl.appendChild(document.createElement('a'));
  templateEl.appendChild(document.createElement('span'));

  var refreshResult = function() {
    while (resultEl.children.length > 0) {
      resultEl.removeChild(resultEl.firstChild);
    }
  }

  var appendResults = function(repos) {
    var fragment = document.createDocumentFragment();

    repos.forEach(function(repo) {
      var cloned = templateEl.cloneNode(true);
      var aEl    = cloned.querySelector('a');
      var spanEl = cloned.querySelector('span');

      aEl.textContent = repo.full_name;
      aEl.setAttribute('href', repo.url);

      spanEl.textContent = '(' + repo.stargazers_count + ')'

      fragment.appendChild(cloned);
    });

    resultEl.appendChild(fragment);
  };

  formEl.addEventListener('submit', function(e) {
    e.preventDefault();

    currentAgent = baseAgent.setQueries({ q: inputEl.value.trim() });

    currentAgent
      .fetchJson()
      .then(function(json) {
        refreshResult();
        appendResults(json.items);

        fetchMoreEl.style.display = 'inline-block';
      })
      .catch(function(err) {
        console.error(err);
      });
  });

  fetchMoreEl.addEventListener('click', function() {
    const page = currentAgent.queries.page;

    currentAgent = currentAgent.setQueries({ page: page + 1 });

    currentAgent
      .fetchJson()
      .then(function(json) {
        appendResults(json.items);

        if (json.total_count <= page * 30) {
          fetchMoreEl.style.display = 'none';
        }
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
