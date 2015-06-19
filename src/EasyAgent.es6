import assign  from 'object-assign';
import querify from './querify';

let fetch = () => {
  throw new ReferenceError('fetch is not defined');
};

if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
  fetch = window.fetch;
}

class EasyAgent {
  constructor(url, options = {}) {
    this.url     = url;
    this.method  = options.method  || 'GET';
    this.queries = options.queries || {};
    this.headers = options.headers || {};
    this.body    = options.body    || null;
  }

  __setOptions(options) {
    return new EasyAgent(this.url, assign({}, Object(this), options));
  }

  setUrl(newUrl) {
    return new EasyAgent(newUrl, this.options);
  }

  setMethod(method) {
    return this.__setOptions({ method });
  }

  setHeaders(headers) {
    return this.__setOptions({ headers: assign({}, this.headers, headers) });
  }

  setQueries(queries) {
    return this.__setOptions({ queries: assign({}, this.queries, queries) });
  }

  setBody(body) {
    return this.__setOptions({ body });
  }

  setJson(json) {
    return this.__setOptions({
      body:    JSON.stringify(json),
      headers: assign({}, this.headers, {
        'Content-Type': 'application/json',
      }),
    });
  }

  setForm(form) {
    return this.__setOptions({
      body:    form,
      headers: assign({}, this.headers, {
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    });
  }

  fetch() {
    const querified = querify(this.queries);

    let f = fetch(this.url + querified, {
      method:  this.method,
      headers: this.headers,
      body:    this.body,
    });

    return f;
  }

  fetchJson() {
    return this
      .setHeaders({ 'Accept': 'application/json' })
      .fetch()
      .then(res => res.json());
  }

  fetchText(mimeType = 'text/plain') {
    return this
      .setHeaders({ 'Accept': mimeType })
      .fetch()
      .then(res => res.text());
  }

  static get(url, options) {
    return new EasyAgent(url, assign({ method: 'GET', body: null }, options));
  }

  static post(url, options) {
    return new EasyAgent(url, assign({ method: 'POST', body: null }, options));
  }

  static put(url, options) {
    return new EasyAgent(url, assign({ method: 'PUT', body: null }, options));
  }

  static del(url, options) {
    return new EasyAgent(url, assign({ method: 'DELETE', body: null }, options));
  }

  static head(url, options) {
    return new EasyAgent(url, assign({ method: 'HEAD', body: null }, options));
  }

  static opt(url, options) {
    return new EasyAgent(url, assign({ method: 'OPTIONS', body: null }, options));
  }

  static setFetchFunction(anotherFetch) {
    fetch = anotherFetch;
  }
};

export default EasyAgent;
