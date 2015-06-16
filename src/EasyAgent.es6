import _ from './util';

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
    return new EasyAgent(this.url, _.assign({}, Object(this), options));
  }

  setUrl(newUrl) {
    return new EasyAgent(newUrl, this.options);
  }

  setMethod(method) {
    return this.__setOptions({ method });
  }

  setHeaders(headers) {
    return this.__setOptions({ headers: _.assign({}, this.headers, headers) });
  }

  setQueries(queries) {
    return this.__setOptions({ queries: _.assign({}, this.queries, queries) });
  }

  setBody(body) {
    return this.__setOptions({ body });
  }

  setJson(json) {
    return this.__setOptions({
      body:    JSON.stringify(json),
      headers: _.assign({}, this.headers, {
        'Content-Type': 'application/json',
      }),
    });
  }

  setForm(form) {
    return this.__setOptions({
      body:    form,
      headers: _.assign({}, this.headers, {
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    });
  }

  fetch() {
    const queryString = _.queryString(this.queries);

    let f = fetch(this.url + queryString, {
      method:  this.method,
      headers: this.hearders,
      body:    this.body,
    });

    return f;
  }

  fetchJson() {
    return this
      .setHeaders({ 'Accept': 'application/json' })
      .fetch()
      .then((res) => { return res.json() });
  }

  fetchText(mimeType = 'text/plain') {
    return this
      .setHeaders({ 'Accept': mimeType })
      .fetch()
      .then((res) => { return res.text() });
  }

  fetchHtml() {
    return this.fetchText('text/html');
  }

  static get(url, options) {
    return new EasyAgent(url, _.assign({ method: 'GET', body: null }, options));
  }

  static post(url, options) {
    return new EasyAgent(url, _.assign({ method: 'POST', body: null }, options));
  }

  static put(url, options) {
    return new EasyAgent(url, _.assign({ method: 'PUT', body: null }, options));
  }

  static del(url, options) {
    return new EasyAgent(url, _.assign({ method: 'DELETE', body: null }, options));
  }

  static head(url, options) {
    return new EasyAgent(url, _.assign({ method: 'HEAD', body: null }, options));
  }

  static opt(url, options) {
    return new EasyAgent(url, _.assign({ method: 'OPTIONS', body: null }, options));
  }

  static setFetchFunction(anotherFetch) {
    fetch = anotherFetch;
  }
};

// TODO:
// EasyAgent.addCustomFetcher()

export default EasyAgent;
