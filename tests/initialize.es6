import ES6Promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
import expect from 'expect.js';

global.Promise = ES6Promise.Promise;
global.fetch = fetch;
global.expect = expect;
