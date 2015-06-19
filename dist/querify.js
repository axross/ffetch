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