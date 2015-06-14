const _ = {};

_.clone = obj => {
  const newObj = {};
  const keys = Object.keys(obj);

  for (let i = 0; i < keys.length; ++i) {
    newObj[keys[i]] = obj[keys[i]];
  }

  return newObj;
};

_.assign = (target, ...sources) => {
  if ('assign' in Object) return Object.assign(target, ...sources);

  return ((target, ...sources) => {
    const newTarget = clone(target);

    for (let i = 0; i < sources.length; ++i) {
      let source = sources[i];
      let keys = Object.keys(source);

      for (let j = 0; j < keys.length; ++j) {
        newTarget[keys[j]] = source[keys[j]];
      }
    }

    return newTarget;
  })(target, ...sources);
};

_.queryString = obj => {
  const keys = Object.keys(obj);

  if (keys.length === 0) return '';

  const pairs = keys.map(key => {
    return `${key}=${obj[key]}`;
  });

  return `?${pairs.join('&')}`;
};

export default _;
