import querystring from 'querystring';

// get a global object
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

export const __util = {
  /**
   * Sanitizing a HTTP method.
   * @param {string} method
   * @return {string} An upper-cased method.
   */
  __sanitizeMethod(method) {
    const upperCased = String(method).toUpperCase();

    if (AVAILABLE_METHODS.indexOf(upperCased) === -1) {
      throw new TypeError(
        `method must be a string of : ${AVAILABLE_METHODS.join(', ')}`
      );
    }

    return upperCased;
  },

  /**
   * Create a full URL that parsed params and joined queries.
   * @param {string} base
   * @param {object} [params] `:foo` in `base` will parse to
                             `aaa` with `{ foo: 'aaa' }`.
   * @param {object} [queries] `{ bar: 'bbb' }` will join to base, `base?bar=bbb`.
   * @return {string} A full URL.
   */
  __createFullUrl(base, params = {}, queries = {}) {
    let url = base;

    if (Object.prototype.toString.call(params) !== '[object Object]') {
      throw new TypeError('params must be an object');
    }

    for (const key of Object.keys(params)) {
      if (url.indexOf(`:${key}`) !== -1) {
        url = url.replace(`:${key}`, params[key]);
      }
    }

    if (Object.keys(queries).length > 0) {
      url = `${url}?${querystring.stringify(queries)}`;
    }

    return url;
  },
};

/**
 * Trying to fetch.
 * @param {string} url
 * @param {object} options
 * @param {string} options.method
 * @param {object} [options.params]
 * @param {object} [options.queries]
 * @param {object} [options.header] Keys and values of HTTP request header.
 * @param {string|object} [options.body] A HTTP request body.
 * @return {Promise<Request, TypeError>}
 * @example
 * fetch('/path/to/api/article/:id', { method: 'GET', params: { id: 3 } });
 *
 * // short-hand (get, post, put, del, head, opt)
 * fetch.get('/path/to/api/article/:id', { params: { id: 3 } });
 */
export const ffetch = (url, options) => {
  const method = __util.__sanitizeMethod(options.method);
  const fullUrl = __util.__createFullUrl(url, options.params, options.queries);
  let header = {};
  let body = options.body;
  let timeout = parseInt(options.timeout, 10);

  // set default value if timeout is invalid
  if (typeof timeout !== 'number' || Number.isNaN(timeout) || timeout <= 0) {
    timeout = 60000;  // default 60sec
  }

  // replace keys of header to lower case
  for (const key of Object.keys(options.header || {})) {
    header[key.toLowerCase()] = options.header[key];
  }

  // stringify body and add a header if it is a plain object or an array
  if (Object.prototype.toString.call(body) === '[object Object]' ||
      Object.prototype.toString.call(body) === '[object Array]') {
    body = JSON.stringify(body);
    header = Object.assign({
      'content-type': 'application/json',
    }, header);
  }

  const parsedOptions = Object.assign({}, options, {
    method,
    header,
    body,
  });

  return new Promise((resolve, reject) => {
    const stid = setTimeout(() => {
      reject(new Error('Session timeout'));
    }, timeout);

    self.fetch(fullUrl, parsedOptions)
      .then(res => {
        clearTimeout(stid);

        resolve(res);
      })
      .catch(err => reject(err));
  });
};

ffetch.get = (url, options) => {
  return ffetch(url, Object.assign({}, options, { method: 'GET' }));
};

ffetch.post = (url, options) => {
  return ffetch(url, Object.assign({}, options, { method: 'POST' }));
};

ffetch.put = (url, options) => {
  return ffetch(url, Object.assign({}, options, { method: 'PUT' }));
};

ffetch.del = (url, options) => {
  return ffetch(url, Object.assign({}, options, { method: 'DELETE' }));
};

ffetch.head = (url, options) => {
  return ffetch(url, Object.assign({}, options, { method: 'HEAD' }));
};

ffetch.opt = (url, options) => {
  return ffetch(url, Object.assign({}, options, { method: 'OPTIONS' }));
};

export default ffetch;
