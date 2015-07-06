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
    this.credentials = options.credentials;
    this.chache = options.chache;
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

      return _fetch(this.url + querified, {
        method: this.method,
        headers: this.headers,
        body: this.body
      });
    }
  }, {
    key: 'fetchJson',
    value: function fetchJson() {
      return this.setHeaders({ Accept: 'application/json' }).fetch().then(function (res) {
        return res.json();
      });
    }
  }, {
    key: 'fetchText',
    value: function fetchText() {
      var mimeType = arguments[0] === undefined ? 'text/plain' : arguments[0];

      return this.setHeaders({ Accept: mimeType }).fetch().then(function (res) {
        return res.text();
      });
    }
  }], [{
    key: 'get',
    value: function get(url, options) {
      return new EasyAgent(url, (0, _objectAssign2['default'])({
        method: 'GET',
        body: null
      }, options));
    }
  }, {
    key: 'post',
    value: function post(url, options) {
      return new EasyAgent(url, (0, _objectAssign2['default'])({
        method: 'POST',
        body: null
      }, options));
    }
  }, {
    key: 'put',
    value: function put(url, options) {
      return new EasyAgent(url, (0, _objectAssign2['default'])({
        method: 'PUT',
        body: null
      }, options));
    }
  }, {
    key: 'del',
    value: function del(url, options) {
      return new EasyAgent(url, (0, _objectAssign2['default'])({
        method: 'DELETE',
        body: null
      }, options));
    }
  }, {
    key: 'head',
    value: function head(url, options) {
      return new EasyAgent(url, (0, _objectAssign2['default'])({
        method: 'HEAD',
        body: null
      }, options));
    }
  }, {
    key: 'opt',
    value: function opt(url, options) {
      return new EasyAgent(url, (0, _objectAssign2['default'])({
        method: 'OPTIONS',
        body: null
      }, options));
    }
  }, {
    key: 'setFetchFunction',
    value: function setFetchFunction(anotherFetch) {
      _fetch = anotherFetch;
    }
  }]);

  return EasyAgent;
})();

exports['default'] = EasyAgent;
module.exports = exports['default'];