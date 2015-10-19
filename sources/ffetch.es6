import querystring from 'querystring';

// get a global object
/* eslint-disable no-new-func */
const self = Function('return this');
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
   * Create a full URL that parsed param and joined query.
   * @param {string} base
   * @param {object} [param] `:foo` in `base` will parse to
                             `aaa` with `{ foo: 'aaa' }`.
   * @param {object} [query] `{ bar: 'bbb' }` will join to base, `base?bar=bbb`.
   * @return {string} A full URL.
   */
  __createFullUrl(base, param = {}, query = {}) {
    let url = base;

    if (Object.prototype.toString.call(param) !== '[object Object]') {
      throw new TypeError('param must be an object');
    }

    for (const key of Object.keys(param)) {
      if (url.indexOf(`:${key}`) !== -1) {
        url = url.replace(`:${key}`, param[key]);
      }
    }

    if (Object.keys(query).length > 0) {
      url = `${url}?${querystring.stringify(query)}`;
    }

    return url;
  },
};

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
export const ffetch = (url, options) => {
  const method = __util.__sanitizeMethod(options.method);
  const fullUrl = __util.__createFullUrl(url, options.param, options.query);
  let header = {};
  let body = options.body;

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

  return self.fetch(fullUrl, parsedOptions);
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
