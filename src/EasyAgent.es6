import _ from './util';

const __plugins = [];

class EasyAgent {
  constructor(url, options = {}) {
    this.url     = url;
    this.method  = options.method  || 'GET';
    this.queries = options.queries || {};
    this.headers = options.headers || {};
    this.body    = options.body    || null;
    this.plugins = options.plugins || __plugins;
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

  setJSONBody(json) {
    const jsonStr = JSON.stringify(json);

    return this.setOptions({
      body:    jsonStr,
      headers: _.assign(this.headers, {
        'Content-Type': 'application/json',
      }),
    });
  }

  setFormBody(form) {
    if (!(form instanceof Form)) {
      form = new Form(form);
    }

    return this.setOptions({
      body: form,
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

  getResponse() {
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

  getJSON() {
    return this
      .setHeaders({ 'Accept': 'application/json' })
      .getResponse()
      .then((res) => { return res.json() });
  }

  getText(mimeType = 'text/plain') {
    return this
      .setHeaders({ 'Accept': mimeType })
      .getResponse()
      .then((res) => { return res.text() });
  }

  getHTML() {
    return this.getText('text/html');
  }

  static globalUse(plugin) {
    __plugin.push(plugin);
  }

  static globalUnuse(plugin) {
    const index = __plugins.indexOf(plugin);

    if (index < 0) return false;

    __plugins.splice(index, 1);
  }

  static globalUnuseAll() {
    __plugins.splice(0, __plugins.length);
  }
};

export default EasyAgent;
