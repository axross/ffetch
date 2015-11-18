import test from 'tape';
import querystring from 'querystring';
import ffetch, { FFetch } from '../sources';

test('FFetch.createFullUrl() helps to parse the URL using base, params and queries', t => {
  const patterns = [
    {
      input: {
        base: '/path/to/api/post/:id',
        params: { id: 25 },
        queries: { foo: 'bar' },
      },
      expected: '/path/to/api/post/25',
      isNeedQueryString: true,
    },
    {
      input: {
        base: '/path/to/api/post/:id:/:id',
        params: { id: 25 },
        queries: {},
      },
      expected: '/path/to/api/post/25:/25',
      isNeedQueryString: false,
    },
    {
      input: {
        base: '/path/to/api/post',
        params: {},
        queries: {
          foo: 'bar',
          baz: 'qux',
        },
      },
      expected: '/path/to/api/post',
      isNeedQueryString: true,
    },
    {
      input: {
        base: '/path/to/api/post/:id/comment/:commentId',
        params: { id: 25, commentId: 5963 },
        queries: {
          foo: 'bar',
          columns: ['id', 'title', 'body', 'createdAt'],
          baz: 'qux',
        },
      },
      expected: '/path/to/api/post/25/comment/5963',
      isNeedQueryString: true,
    },
    {
      input: {
        base: 'a',
      },
      expected: 'a',
      isNeedQueryString: false,
    },
  ];

  t.plan(patterns.length);

  patterns.forEach(({ input, expected, isNeedQueryString }) => {
    t.equal(
      FFetch.createFullUrl(input),
      `${expected}${isNeedQueryString ? '?' : ''}${querystring.stringify(input.queries)}`
    );
  });
});

test('FFetch.createFullUrl() throws a TypeError if params is not a plain-object', t => {
  const args = {
    base: '',
    queries: {},
  };

  const validPatterns = [
    {},
    { foo: 'bar' },
    { foo: 12 },
    /* eslint-disable no-undefined */
    undefined,
    /* eslint-enable no-undefined */
  ];

  const invalidPatterns = [
    'str',
    123,
    true,
    null,
    [],
    /^regexp$/,
    new Date(),
    () => {},
  ];

  t.plan(validPatterns.length + invalidPatterns.length);

  FFetch.createFullUrl('base', {}, 'str');

  validPatterns.forEach(params => {
    t.doesNotThrow(() => {
      return FFetch.createFullUrl(Object.assign({}, args, { params }));
    });
  });

  invalidPatterns.forEach(params => {
    t.throws(() => {
      return FFetch.createFullUrl(Object.assign({}, args, { params }));
    });
  });
});

test('FFetch.createFullUrl() throws a TypeError if params includes a string of value it starts with ":"', t => {
  t.plan(1);

  t.throws(() => {
    return FFetch.createFullUrl({
      base: '',
      params: { foo: ':bar' },
    });
  });
});

test('FFetch.sanitizeMethod() uppercases a method', t => {
  const patterns = [
    'get',
    'POST',
    'pUt',
    'Delete',
  ];

  t.plan(patterns.length);

  patterns.forEach(method => {
    t.equal(FFetch.sanitizeMethod(method), method.toUpperCase());
  });
});

test('FFetch.sanitizeMethod() throws a TypeError if method is not unavailable one', t => {
  const invalidPatterns = [
    'GETS',
    'guts',
    'Posting',
    'REMOVE',
    'PATCH',
  ];

  t.plan(invalidPatterns.length);

  invalidPatterns.forEach(method => {
    t.throws(() => {
      return FFetch.sanitizeMethod(method);
    });
  });
});

test('FFetch.lowercaseHeaderKeys()', t => {
  t.plan(1);

  t.deepEqual(FFetch.lowercaseHeaderKeys({
    'Content-Type': 'application/json',
    'X-Auth-Token': '123456789ABCDEF0',
    'are-you-ok': 'of cause',
    camelCase: 'Will be lowercased',
  }), {
    'content-type': 'application/json',
    'x-auth-token': '123456789ABCDEF0',
    'are-you-ok': 'of cause',
    camelcase: 'Will be lowercased',
  });
});

test('An instance of FFetch includes members baseUrl, defaultHeaders and fetch from the first argument', t => {
  t.plan(8);

  const options = {
    baseUrl: 'http://base.url',
    headers: {
      'x-auth-token': '123456789abcdef0',
    },
    fetch: () => {},
    timeout: 30000,
  };

  const ff = new FFetch(options);

  t.equal(ff.baseUrl, options.baseUrl);
  t.equal(ff.defaultHeaders, options.headers);
  t.equal(ff.timeout, options.defaultTimeout);
  t.equal(ff.fetch, options.fetch);

  const ffNotReceiveAnyOptions = new FFetch();

  t.equal(ffNotReceiveAnyOptions.baseUrl, '');
  t.deepEqual(ffNotReceiveAnyOptions.defaultHeaders, {});
  t.ok(
    ffNotReceiveAnyOptions.defaultTimeout > 0,
    'should greater than 0'
  );
  t.equal(ffNotReceiveAnyOptions.fetch, global.fetch);
});

test('FFetch#friendlyFetch() calls this.fetch and returns Promise<Response> it handles this.fetch()', t => {
  t.plan(2);

  const ff = new FFetch({
    fetch: () => Promise.resolve('response'),
  });

  ff.friendlyFetch('/path/to/api', { method: 'GET' })
    .then(res => t.equal(res, 'response'))
    .catch(() => t.fail('should not be called'));

  const maybeFailFF = new FFetch({
    fetch: () => Promise.reject(new Error()),
  });

  maybeFailFF.friendlyFetch('/path/to/api', { method: 'POST' })
    .then(() => t.fail('should not be called'))
    .catch(err => t.ok(err instanceof Error, 'should be an Error'));
});

test('FFetch#friendlyFetch() reject the Promise when time passes than timeout', t => {
  t.plan(2);

  let timeoutIdOfFF = null;

  const ff = new FFetch({
    fetch: () => new Promise(resolve => {
      timeoutIdOfFF = setTimeout(() => resolve(), 1001);
    }),
  });

  ff.friendlyFetch('/path/to/api', {
    method: 'GET',
    timeout: 1000,
  })
    .then(() => t.fail('should not be called'))
    .catch(err => {
      t.ok(err instanceof Error, 'should be an Error');
      t.equal(err.message, 'Session timeout');

      clearTimeout(timeoutIdOfFF);
    });
});
