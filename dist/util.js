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