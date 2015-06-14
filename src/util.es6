import assign from 'object-assign';

const queryString = obj => {
  const keys = Object.keys(obj);

  if (keys.length === 0) return '';

  const pairs = keys.map(key => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
  });

  return `?${pairs.join('&')}`;
};

export default {
  assign,
  queryString,
};
