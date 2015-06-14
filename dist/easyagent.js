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

var __plugins = [];

var EasyAgent = (function () {
  function EasyAgent(url) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, EasyAgent);

    this.url = url;
    this.method = options.method || 'GET';
    this.queries = options.queries || {};
    this.headers = options.headers || {};
    this.body = options.body || null;
    this.plugins = options.plugins || __plugins;
  }

  _createClass(EasyAgent, [{
    key: 'setUrl',
    value: function setUrl(newUrl) {
      return new this.constructor(newUrl, this.options);
    }
  }, {
    key: 'setOptions',
    value: function setOptions(newOptions) {
      var options = _util2['default'].assign(this, newOptions);
      var Uppermethod = options.method.toUpperCase();
      var body = options.body;

      if (body !== null && (upperMethod === 'GET' || upperMethod === 'HEAD')) {
        throw new TypeError('Body not allowed for GET or HEAD requests');
      }

      return new this.constructor(this.url, newOptions);
    }
  }, {
    key: 'setMethod',
    value: function setMethod(method) {
      return this.setOptions({ method: method });
    }
  }, {
    key: 'setHeaders',
    value: function setHeaders(headers) {
      return this.setOptions({ headers: headers });
    }
  }, {
    key: 'setBody',
    value: function setBody(body) {
      return this.setOptions({ body: body });
    }
  }, {
    key: 'setJSONBody',
    value: function setJSONBody(json) {
      var jsonStr = JSON.stringify(json);

      return this.setOptions({
        body: jsonStr,
        headers: _util2['default'].assign(this.headers, {
          'Content-Type': 'application/json'
        })
      });
    }
  }, {
    key: 'setFormBody',
    value: function setFormBody(form) {
      if (!(form instanceof Form)) {
        form = new Form(form);
      }

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
      return this.setOptions({ queries: queries });
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
    key: 'fetchJSON',
    value: function fetchJSON() {
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
    key: 'fetchHTML',
    value: function fetchHTML() {
      return this.fetchText('text/html');
    }
  }], [{
    key: 'globalUse',
    value: function globalUse(plugin) {
      __plugin.push(plugin);
    }
  }, {
    key: 'globalUnuse',
    value: function globalUnuse(plugin) {
      var index = __plugins.indexOf(plugin);

      if (index < 0) return false;

      __plugins.splice(index, 1);
    }
  }, {
    key: 'globalUnuseAll',
    value: function globalUnuseAll() {
      __plugins.splice(0, __plugins.length);
    }
  }]);

  return EasyAgent;
})();

;

exports['default'] = EasyAgent;
module.exports = exports['default'];

},{"./util":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _EasyAgent = require('./EasyAgent');

var _EasyAgent2 = _interopRequireDefault(_EasyAgent);

var request = function request(url, options) {
  return new _EasyAgent2['default'](url, options);
};

request.get = function (url, options) {
  return request(url, _util2['default'].assign({ method: 'GET', body: null }, options));
};

request.post = function (url, options) {
  return request(url, _util2['default'].assign({ method: 'POST' }, options));
};

request.put = function (url, options) {
  return request(url, _util2['default'].assign({ method: 'PUT' }, options));
};

request.del = function (url, options) {
  return request(url, _util2['default'].assign({ method: 'DELETE' }, options));
};

request.head = function (url, options) {
  return request(url, _util2['default'].assign({ method: 'HEAD', body: null }, options));
};

request.opt = function (url, options) {
  return request(url, _util2['default'].assign({ method: 'OPTIONS' }, options));
};

request.setFetch = function (newFetch) {
  fetch = newFetch;
};

request.setForm = function (newForm) {
  Form = newForm;
};

exports['default'] = request;
module.exports = exports['default'];

},{"./EasyAgent":1,"./util":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _ = {};

_.clone = function (obj) {
  var newObj = {};
  var keys = Object.keys(obj);

  for (var i = 0; i < keys.length; ++i) {
    newObj[keys[i]] = obj[keys[i]];
  }

  return newObj;
};

_.assign = function (target) {
  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  if ('assign' in Object) return Object.assign.apply(Object, [target].concat(sources));

  return (function (target) {
    for (var _len2 = arguments.length, sources = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      sources[_key2 - 1] = arguments[_key2];
    }

    var newTarget = clone(target);

    for (var i = 0; i < sources.length; ++i) {
      var source = sources[i];
      var keys = Object.keys(source);

      for (var j = 0; j < keys.length; ++j) {
        newTarget[keys[j]] = source[keys[j]];
      }
    }

    return newTarget;
  }).apply(undefined, [target].concat(sources));
};

_.queryString = function (obj) {
  var keys = Object.keys(obj);

  if (keys.length === 0) return '';

  var pairs = keys.map(function (key) {
    return '' + key + '=' + obj[key];
  });

  return '?' + pairs.join('&');
};

exports['default'] = _;
module.exports = exports['default'];

},{}]},{},[2]);
