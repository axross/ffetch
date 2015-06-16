const encode = str => {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => {
    return '%' + c.charCodeAt(0).toString(16);
  });
};

const whenArray = (key, arr) => {
  return arr.map(value => {
    return `${encode(key)}[]=${encode(value)}`
  }).join('&');
};

const whenObject = (key, obj) => {
  return Object.keys(obj).map(idx => {
    return `${encode(key)}[${encode(idx)}]=${encode(obj[idx])}`
  }).join('&');
};

const whenString = (key, str) => {
  return `${encode(key)}=${encode(str)}`;
};

const querify = obj => {
  const keys = Object.keys(obj);

  if (keys.length === 0) return '';

  const pairs = keys.map(key => {
    const value = obj[key];

    if (Array.isArray(value)) {
      return whenArray(key, value);
    }
    if (Object.prototype.toString.call(value) === '[object Object]') {
      return whenObject(key, value);
    }

    return whenString(key, String(value));
  });

  return `?${pairs.join('&')}`;
};

export default querify;
