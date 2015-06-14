import _ from './util';

const globalPlugins = [];

let fetch = window.fetch || function() {
  throw new ReferenceError('fetch is not defined');
};

class EasyAgent {
  constructor(url, options = {}) {
    this.url     = url;
    this.method  = options.method  || 'GET';
    this.queries = options.queries || {};
    this.headers = options.headers || {};
    this.body    = options.body    || null;
    this.plugins = options.plugins || globalPlugins;
  }

  setUrl(newUrl) {
    return new this.constructor(newUrl, this.options);
  }

  setOptions(newOptions) {
    const options     = _.assign(this, newOptions);
    const Uppermethod = options.method.toUpperCase();
    const body        = options.body;

    if (body !== null && (upperMethod === 'GET' || upperMethod === 'HEAD')) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }

    return new this.constructor(this.url, newOptions);
  }

  setMethod(method) {
    return this.setOptions({ method });
  }

  setHeaders(headers) {
    return this.setOptions({ headers });
  }

  setBody(body) {
    return this.setOptions({ body });
  }

  setJson(json) {
    const jsonStr = JSON.stringify(json);

    return this.setOptions({
      body:    jsonStr,
      headers: _.assign(this.headers, {
        'Content-Type': 'application/json',
      }),
    });
  }

  setForm(form) {
    return this.setOptions({
      body:    form,
      headers: _.assign(this.headers, {
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    });
  }

  setQueries(queries) {
    return this.setOptions({ queries });
  }

  use(plugin) {
    return this.setOptions({ plugins: this.plugins.concat([plugin]) });
  }

  fetchResponse() {
    const queryString = _.queryString(this.queries);

    let f = fetch(this.url + queryString, {
      method:  this.method,
      headers: this.hearders,
      body:    this.body,
    });

    if (this.plugins.length > 0) {
      f = this.plugins.reduce((__f, plugin) => {
        return plugin(__f).call(__f);
      }, f);
    }

    return f;
  }

  fetchJson() {
    return this
      .setHeaders({ 'Accept': 'application/json' })
      .fetchResponse()
      .then((res) => { return res.json() });
  }

  fetchText(mimeType = 'text/plain') {
    return this
      .setHeaders({ 'Accept': mimeType })
      .fetchResponse()
      .then((res) => { return res.text() });
  }

  fetchHtml() {
    return this.fetchText('text/html');
  }

  static get(url, options) {
    return new this(url, _.assign({ method: 'GET', body: null }, options));
  }

  static post(url, options) {
    return new this(url, _.assign({ method: 'POST', body: null }, options));
  }

  static put(url, options) {
    return new this(url, _.assign({ method: 'PUT', body: null }, options));
  }

  static del(url, options) {
    return new this(url, _.assign({ method: 'DELETE', body: null }, options));
  }

  static head(url, options) {
    return new this(url, _.assign({ method: 'HEAD', body: null }, options));
  }

  static opt(url, options) {
    return new this(url, _.assign({ method: 'OPTIONS', body: null }, options));
  }

  static setFetchFunction(anotherFetch) {
    fetch = anotherFetch;
  }

  static use(plugin) {
    globalPlugins.push(plugin);
  }

  static unuse(plugin) {
    const index = globalPlugins.indexOf(plugin);

    if (index < 0) return false;

    globalPlugins.splice(index, 1);
  }

  static unuseAll() {
    globalPlugins.splice(0, globalPlugins.length);
  }
};

export default EasyAgent;
