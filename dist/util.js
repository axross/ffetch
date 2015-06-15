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