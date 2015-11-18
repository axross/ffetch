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

test('FFetch#friendlyFetch uses this.baseUrl as prefix for this.url', t => {
  t.plan(1);

  const ff = new FFetch({
    baseUrl: 'http://i.am.base',
    fetch: fullUrl => {
      t.equal(fullUrl, 'http://i.am.base/join/me');

      return Promise.resolve();
    },
  });

  ff.friendlyFetch('/join/me', { method: 'GET' });
});

test('FFetch#friendlyFetch merges this.headers to this.defaultHeaders', t => {
  t.plan(1);

  const ff = new FFetch({
    headers: {
      foo: 'bar',
    },
    fetch: (_, parsedOptions) => {
      t.deepEqual(parsedOptions.headers, {
        foo: 'bar',
        buz: 'qux',
      });

      return Promise.resolve();
    },
  });

  ff.friendlyFetch('/join/me', {
    method: 'GET',
    headers: {
      buz: 'qux',
    },
  });
});

test('FFetch#friendlyFetch() resolves url, method, params, queries, headers and body', t => {
  t.plan(4);

  const ff = new FFetch({
    fetch: (fullUrl, parsedOptions) => {
      t.equal(
        fullUrl,
        '/path/to/api/post/98/comment/345?foo=bar&baz=qux'
      );
      t.deepEqual(parsedOptions.headers, {
        'content-type': 'application/json',
        accept: 'application/json',
        'x-access-token': '123456789ABCDEF0',
      });
      t.equal(parsedOptions.body, JSON.stringify({
        abc: 123,
        def: 456,
      }));

      return Promise.resolve();
    },
  });

  ff.friendlyFetch('/path/to/api/post/:id/comment/:commentId', {
    method: 'GET',
    params: {
      id: 98,
      commentId: 345,
    },
    queries: {
      foo: 'bar',
      baz: 'qux',
    },
    headers: {
      'Accept': 'application/json',
      'X-Access-Token': '123456789ABCDEF0',
    },
    body: {
      abc: 123,
      def: 456,
    },
  })
    .then(() => {
      t.ok(true, 'should be called');
    });
});

test('FFetch#get() is just a shorthand to FFetch#friendlyFetch()', t => {
  t.plan(3);

  const cachedFriendlyFetch = FFetch.prototype.friendlyFetch;

  FFetch.prototype.friendlyFetch = function(url, options) {
    t.equal(url, '/path/to/api');
    t.deepEqual(options, {
      method: 'GET',
      body: 'body',
    });

    return cachedFriendlyFetch.call(this, url, options)
      .then(() => t.ok(true, 'should be called'));
  };

  const ff = new FFetch({
    fetch: () => Promise.resolve(),
  });

  ff.get('/path/to/api', { body: 'body' });

  FFetch.prototype.friendlyFetch = cachedFriendlyFetch;
});

test('FFetch#post() is just a shorthand to FFetch#friendlyFetch()', t => {
  t.plan(3);

  const cachedFriendlyFetch = FFetch.prototype.friendlyFetch;

  FFetch.prototype.friendlyFetch = function(url, options) {
    t.equal(url, '/path/to/api');
    t.deepEqual(options, {
      method: 'POST',
      body: 'body',
    });

    return cachedFriendlyFetch.call(this, url, options)
      .then(() => t.ok(true, 'should be called'));
  };

  const ff = new FFetch({
    fetch: () => Promise.resolve(),
  });

  ff.post('/path/to/api', { body: 'body' });

  FFetch.prototype.friendlyFetch = cachedFriendlyFetch;
});

test('FFetch#put() is just a shorthand to FFetch#friendlyFetch()', t => {
  t.plan(3);

  const cachedFriendlyFetch = FFetch.prototype.friendlyFetch;

  FFetch.prototype.friendlyFetch = function(url, options) {
    t.equal(url, '/path/to/api');
    t.deepEqual(options, {
      method: 'PUT',
      body: 'body',
    });

    return cachedFriendlyFetch.call(this, url, options)
      .then(() => t.ok(true, 'should be called'));
  };

  const ff = new FFetch({
    fetch: () => Promise.resolve(),
  });

  ff.put('/path/to/api', { body: 'body' });

  FFetch.prototype.friendlyFetch = cachedFriendlyFetch;
});

test('FFetch#del() is just a shorthand to FFetch#friendlyFetch()', t => {
  t.plan(3);

  const cachedFriendlyFetch = FFetch.prototype.friendlyFetch;

  FFetch.prototype.friendlyFetch = function(url, options) {
    t.equal(url, '/path/to/api');
    t.deepEqual(options, {
      method: 'DELETE',
      body: 'body',
    });

    return cachedFriendlyFetch.call(this, url, options)
      .then(() => t.ok(true, 'should be called'));
  };

  const ff = new FFetch({
    fetch: () => Promise.resolve(),
  });

  ff.del('/path/to/api', { body: 'body' });

  FFetch.prototype.friendlyFetch = cachedFriendlyFetch;
});

test('FFetch#head() is just a shorthand to FFetch#friendlyFetch()', t => {
  t.plan(3);

  const cachedFriendlyFetch = FFetch.prototype.friendlyFetch;

  FFetch.prototype.friendlyFetch = function(url, options) {
    t.equal(url, '/path/to/api');
    t.deepEqual(options, {
      method: 'HEAD',
      body: 'body',
    });

    return cachedFriendlyFetch.call(this, url, options)
      .then(() => t.ok(true, 'should be called'));
  };

  const ff = new FFetch({
    fetch: () => Promise.resolve(),
  });

  ff.head('/path/to/api', { body: 'body' });

  FFetch.prototype.friendlyFetch = cachedFriendlyFetch;
});

test('FFetch#opt() is just a shorthand to FFetch#friendlyFetch()', t => {
  t.plan(3);

  const cachedFriendlyFetch = FFetch.prototype.friendlyFetch;

  FFetch.prototype.friendlyFetch = function(url, options) {
    t.equal(url, '/path/to/api');
    t.deepEqual(options, {
      method: 'OPTIONS',
      body: 'body',
    });

    return cachedFriendlyFetch.call(this, url, options)
      .then(() => t.ok(true, 'should be called'));
  };

  const ff = new FFetch({
    fetch: () => Promise.resolve(),
  });

  ff.opt('/path/to/api', { body: 'body' });

  FFetch.prototype.friendlyFetch = cachedFriendlyFetch;
});

test('ffetch is just a plain instance of FFetch', t => {
  t.plan(2);

  t.ok(ffetch instanceof FFetch, 'should be just an instance');
  t.deepEqual(ffetch, new FFetch());
});
