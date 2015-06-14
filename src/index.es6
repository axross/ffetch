import _         from './util';
import EasyAgent from './EasyAgent';

const request = (url, options) => {
  return new EasyAgent(url, options);
};

request.get = (url, options) => {
  return request(url, _.assign({ method: 'GET', body: null }, options));
};

request.post = (url, options) => {
  return request(url, _.assign({ method: 'POST' }, options));
};

request.put = (url, options) => {
  return request(url, _.assign({ method: 'PUT' }, options));
};

request.del = (url, options) => {
  return request(url, _.assign({ method: 'DELETE' }, options));
};

request.head = (url, options) => {
  return request(url, _.assign({ method: 'HEAD', body: null }, options));
};

request.opt = (url, options) => {
  return request(url, _.assign({ method: 'OPTIONS' }, options));
};

request.setFetch = (newFetch) => {
  fetch = newFetch;
};

request.setForm = (newForm) => {
  Form = newForm;
};

export default request;
