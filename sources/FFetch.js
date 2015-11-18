import isPlainObject from 'is-plain-object';
import querystring from 'querystring';

// get the global object
/* eslint-disable no-new-func */
const self = Function('return this')();
/* eslint-enable no-new-func */

const AVAILABLE_METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'HEAD',
  'OPTIONS',
];
const DEFAULT_TIMEOUT_MILLISEC = 60000;

export class FFetch {
  constructor({ baseUrl = '', headers = {}, timeout = DEFAULT_TIMEOUT_MILLISEC, fetch = self.fetch } = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = headers;
    this.defaultTimeout = timeout;
    this.fetch = fetch;
  }

  get(url, options) {
    return this.friendlyFetch(url, Object.assign({}, options, {
      method: 'GET',
    }));
  }

  post(url, options) {
    return this.friendlyFetch(url, Object.assign({}, options, {
      method: 'POST',
    }));
  }

  put(url, options) {
    return this.friendlyFetch(url, Object.assign({}, options, {
      method: 'PUT',
    }));
  }

  del(url, options) {
    return this.friendlyFetch(url, Object.assign({}, options, {
      method: 'DELETE',
    }));
  }

  head(url, options) {
    return this.friendlyFetch(url, Object.assign({}, options, {
      method: 'HEAD',
    }));
  }

  opt(url, options) {
    return this.friendlyFetch(url, Object.assign({}, options, {
      method: 'OPTIONS',
    }));
  }

  friendlyFetch(url, options) {
    const method = FFetch.sanitizeMethod(options.method);
    const fullUrl = FFetch.createFullUrl(
      this.baseUrl + url,
      options.params,
      options.queries
    );
    let timeout = parseInt(options.timeout, 10);
    let headers = FFetch.lowercaseHeaderKeys(
      Object.assign({}, this.defaultHeaders, options.headers)
    );
    let body = options.body;

    // set default value if timeout is invalid
    if (typeof timeout !== 'number' || Number.isNaN(timeout) || timeout <= 0) {
      timeout = DEFAULT_TIMEOUT_MILLISEC;
    }

    // stringify body and add a headers if it is a plain object or an array
    if (isPlainObject(body) || Array.isArray(body)) {
      body = JSON.stringify(body);
      headers = Object.assign({
        'content-type': 'application/json',
      }, headers);
    }

    const parsedOptions = Object.assign({}, options, {
      method,
      headers,
      body,
    });

    return new Promise((resolve, reject) => {
      const stid = setTimeout(() => {
        reject(new Error('Session timeout'));
      }, timeout);

      this.fetch(fullUrl, parsedOptions)
        .then(res => {
          clearTimeout(stid);

          resolve(res);
        })
        .catch(err => {
          clearTimeout(stid);

          reject(err);
        });
    });
  }

  static createFullUrl({ base = '', params = {}, queries = {} } = {}) {
    let url = base;

    if (!isPlainObject(params)) {
      throw new TypeError('params is not a Plain-object');
    }

    for (const key of Object.keys(params)) {
      if (String(params[key]).startsWith(':')) {
        throw new TypeError(`params.${key} is invalid String. it must not start with ":".`);
      }

      while (url.indexOf(`:${key}`) !== -1) {
        url = url.replace(`:${key}`, params[key]);
      }
    }

    if (Object.keys(queries).length > 0) {
      url = `${url}?${querystring.stringify(queries)}`;
    }

    return url;
  }

  static sanitizeMethod(method) {
    const upperCased = String(method).toUpperCase();

    if (AVAILABLE_METHODS.indexOf(upperCased) === -1) {
      throw new TypeError(
        `method must be a string of : ${AVAILABLE_METHODS.join(', ')}`
      );
    }

    return upperCased;
  }

  static lowercaseHeaderKeys(input) {
    const output = {};

    // replace keys of headers to lower case
    for (const key of Object.keys(input)) {
      output[key.toLowerCase()] = input[key];
    }

    return output;
  }
}
