'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

// get the global object
/* eslint-disable no-new-func */
var self = Function('return this')();
/* eslint-enable no-new-func */

var AVAILABLE_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'];
var DEFAULT_TIMEOUT_MILLISEC = 60000;

var FFetch = (function () {
  function FFetch() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$baseUrl = _ref.baseUrl;
    var baseUrl = _ref$baseUrl === undefined ? '' : _ref$baseUrl;
    var _ref$headers = _ref.headers;
    var headers = _ref$headers === undefined ? {} : _ref$headers;
    var _ref$timeout = _ref.timeout;
    var timeout = _ref$timeout === undefined ? DEFAULT_TIMEOUT_MILLISEC : _ref$timeout;
    var _ref$fetch = _ref.fetch;
    var fetch = _ref$fetch === undefined ? self.fetch : _ref$fetch;

    _classCallCheck(this, FFetch);

    this.baseUrl = baseUrl;
    this.defaultHeaders = headers;
    this.defaultTimeout = timeout;
    this.fetch = fetch;
  }

  _createClass(FFetch, [{
    key: 'get',
    value: function get(url, options) {
      return this.friendlyFetch(url, Object.assign({}, options, {
        method: 'GET'
      }));
    }
  }, {
    key: 'post',
    value: function post(url, options) {
      return this.friendlyFetch(url, Object.assign({}, options, {
        method: 'POST'
      }));
    }
  }, {
    key: 'put',
    value: function put(url, options) {
      return this.friendlyFetch(url, Object.assign({}, options, {
        method: 'PUT'
      }));
    }
  }, {
    key: 'del',
    value: function del(url, options) {
      return this.friendlyFetch(url, Object.assign({}, options, {
        method: 'DELETE'
      }));
    }
  }, {
    key: 'head',
    value: function head(url, options) {
      return this.friendlyFetch(url, Object.assign({}, options, {
        method: 'HEAD'
      }));
    }
  }, {
    key: 'opt',
    value: function opt(url, options) {
      return this.friendlyFetch(url, Object.assign({}, options, {
        method: 'OPTIONS'
      }));
    }
  }, {
    key: 'friendlyFetch',
    value: function friendlyFetch(url, options) {
      var _this = this;

      var method = FFetch.sanitizeMethod(options.method);
      var fullUrl = FFetch.createFullUrl({
        base: this.baseUrl + url,
        params: options.params,
        queries: options.queries
      });
      var timeout = parseInt(options.timeout, 10);
      var headers = FFetch.lowercaseHeaderKeys(Object.assign({}, this.defaultHeaders, options.headers));
      var body = options.body;

      // set default value if timeout is invalid
      if (typeof timeout !== 'number' || Number.isNaN(timeout) || timeout <= 0) {
        timeout = DEFAULT_TIMEOUT_MILLISEC;
      }

      // stringify body and add a headers if it is a plain object or an array
      if ((0, _isPlainObject2['default'])(body) || Array.isArray(body)) {
        body = JSON.stringify(body);
        headers = Object.assign({
          'content-type': 'application/json'
        }, headers);
      }

      var parsedOptions = Object.assign({}, options, {
        method: method,
        headers: headers,
        body: body
      });

      return new Promise(function (resolve, reject) {
        var stid = setTimeout(function () {
          reject(new Error('Session timeout'));
        }, timeout);

        _this.fetch(fullUrl, parsedOptions).then(function (res) {
          clearTimeout(stid);

          resolve(res);
        })['catch'](function (err) {
          clearTimeout(stid);

          reject(err);
        });
      });
    }
  }], [{
    key: 'sanitizeMethod',
    value: function sanitizeMethod(method) {
      if (!method) throw new TypeError('method is not given');

      var upperCased = String(method).toUpperCase();

      if (AVAILABLE_METHODS.indexOf(upperCased) === -1) {
        throw new TypeError('method must be a string of : ' + AVAILABLE_METHODS.join(', '));
      }

      return upperCased;
    }
  }, {
    key: 'createFullUrl',
    value: function createFullUrl() {
      var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref2$base = _ref2.base;
      var base = _ref2$base === undefined ? '' : _ref2$base;
      var _ref2$params = _ref2.params;
      var params = _ref2$params === undefined ? {} : _ref2$params;
      var _ref2$queries = _ref2.queries;
      var queries = _ref2$queries === undefined ? {} : _ref2$queries;

      var url = base;

      if (!(0, _isPlainObject2['default'])(params)) {
        throw new TypeError('params is not a Plain-object');
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(params)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          if (String(params[key]).startsWith(':')) {
            throw new TypeError('params.' + key + ' is invalid String. it must not start with ":".');
          }

          while (url.indexOf(':' + key) !== -1) {
            url = url.replace(':' + key, params[key]);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (Object.keys(queries).length > 0) {
        url = url + '?' + _querystring2['default'].stringify(queries);
      }

      return url;
    }
  }, {
    key: 'lowercaseHeaderKeys',
    value: function lowercaseHeaderKeys(input) {
      var output = {};

      // replace keys of headers to lower case
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(input)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          output[key.toLowerCase()] = input[key];
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return output;
    }
  }]);

  return FFetch;
})();

exports.FFetch = FFetch;