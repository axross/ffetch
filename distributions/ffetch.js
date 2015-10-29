'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

// get a global object
/* eslint-disable no-new-func */
var self = Function('return this')();
/* eslint-enable no-new-func */

var AVAILABLE_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'];

var __util = {
  /**
   * Sanitizing a HTTP method.
   * @param {string} method
   * @return {string} An upper-cased method.
   */
  __sanitizeMethod: function __sanitizeMethod(method) {
    var upperCased = String(method).toUpperCase();

    if (AVAILABLE_METHODS.indexOf(upperCased) === -1) {
      throw new TypeError('method must be a string of : ' + AVAILABLE_METHODS.join(', '));
    }

    return upperCased;
  },

  /**
   * Create a full URL that parsed param and joined query.
   * @param {string} base
   * @param {object} [param] `:foo` in `base` will parse to
                             `aaa` with `{ foo: 'aaa' }`.
   * @param {object} [query] `{ bar: 'bbb' }` will join to base, `base?bar=bbb`.
   * @return {string} A full URL.
   */
  __createFullUrl: function __createFullUrl(base) {
    var param = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var query = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var url = base;

    if (Object.prototype.toString.call(param) !== '[object Object]') {
      throw new TypeError('param must be an object');
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(param)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        if (url.indexOf(':' + key) !== -1) {
          url = url.replace(':' + key, param[key]);
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

    if (Object.keys(query).length > 0) {
      url = url + '?' + _querystring2['default'].stringify(query);
    }

    return url;
  }
};

exports.__util = __util;
/**
 * Trying to fetch.
 * @param {string} url
 * @param {object} options
 * @param {string} options.method
 * @param {object} [options.param]
 * @param {object} [options.query]
 * @param {object} [options.header] Keys and values of HTTP request header.
 * @param {string|object} [options.body] A HTTP request body.
 * @return {Promise<Request, TypeError>}
 * @example
 * fetch('/path/to/api/article/:id', { method: 'GET', param: { id: 3 } });
 *
 * // short-hand (get, post, put, del, head, opt)
 * fetch.get('/path/to/api/article/:id', { param: { id: 3 } });
 */
var ffetch = function ffetch(url, options) {
  var method = __util.__sanitizeMethod(options.method);
  var fullUrl = __util.__createFullUrl(url, options.param, options.query);
  var header = {};
  var body = options.body;
  var timeout = parseInt(options.timeout, 10);

  // set default value if timeout is invalid
  if (typeof timeout !== 'number' || Number.isNaN(timeout) || timeout <= 0) {
    timeout = 60000; // default 60sec
  }

  // replace keys of header to lower case
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = Object.keys(options.header || {})[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var key = _step2.value;

      header[key.toLowerCase()] = options.header[key];
    }

    // stringify body and add a header if it is a plain object or an array
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

  if (Object.prototype.toString.call(body) === '[object Object]' || Object.prototype.toString.call(body) === '[object Array]') {
    body = JSON.stringify(body);
    header = Object.assign({
      'content-type': 'application/json'
    }, header);
  }

  var parsedOptions = Object.assign({}, options, {
    method: method,
    header: header,
    body: body
  });

  return new Promise(function (resolve, reject) {
    var stid = setTimeout(function () {
      reject(new Error('Session timeout'));
    }, timeout);

    self.fetch(fullUrl, parsedOptions).then(function (res) {
      clearTimeout(stid);

      resolve(res);
    })['catch'](function (err) {
      return reject(err);
    });
  });
};

exports.ffetch = ffetch;
ffetch.get = function (url, options) {
  return ffetch(url, Object.assign({}, options, { method: 'GET' }));
};

ffetch.post = function (url, options) {
  return ffetch(url, Object.assign({}, options, { method: 'POST' }));
};

ffetch.put = function (url, options) {
  return ffetch(url, Object.assign({}, options, { method: 'PUT' }));
};

ffetch.del = function (url, options) {
  return ffetch(url, Object.assign({}, options, { method: 'DELETE' }));
};

ffetch.head = function (url, options) {
  return ffetch(url, Object.assign({}, options, { method: 'HEAD' }));
};

ffetch.opt = function (url, options) {
  return ffetch(url, Object.assign({}, options, { method: 'OPTIONS' }));
};

exports['default'] = ffetch;