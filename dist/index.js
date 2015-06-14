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