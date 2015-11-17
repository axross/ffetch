/* eslint max-nested-callbacks: 0  */

// ヘッダーのキーの小文字化
// JSONのパース
// ショートハンド

import { __util, ffetch } from '../sources/ffetch';

describe('__createFullUrl()', () => {
  describe('should generating a full url using base, params and queries', () => {
    [
      {
        base: '/path/to/api/page/:page',
        params: { page: 1 },
        queries: { order: ['published_at', 'id'], filter: 'open' },
        joined: '/path/to/api/page/1?order=published_at&order=id&filter=open',
      },
      {
        base: '/path/to/api/article/:articleId/comment/:commentId',
        params: { articleId: 23, commentId: 1045 },
        queries: { for_admin: 'true' },
        joined: '/path/to/api/article/23/comment/1045?for_admin=true',
      },
      {
        base: '/path/to/api/article/:articleId/comment/:commentId',
        params: { articleId: 23, commentId: 1045 },
        queries: {},
        joined: '/path/to/api/article/23/comment/1045',
      },
      {
        base: '/path/to/api',
        params: {},
        queries: { order: ['published_at', 'id'], filter: 'open' },
        joined: '/path/to/api?order=published_at&order=id&filter=open',
      },
      {
        base: '/path/to/api',
        params: {},
        queries: {},
        joined: '/path/to/api',
      },
      {
        base: '/path/to/api',
        /* eslint-disable no-undefined */
        params: undefined,
        queries: undefined,
        /* eslint-enable no-undefined */
        joined: '/path/to/api',
      },
    ].forEach(({ base, params, queries, joined }, i) => {
      it(`case ${i}`, () => {
        expect(__util.__createFullUrl(base, params, queries)).to.be(joined);
      });
    });
  });

  it('__createFullUrl() is called when call ffetch()', () => {
    const cached = __util.__createFullUrl;
    const mock = (...args) => {
      expect(args[0]).to.be('/path/to/api/article/:articleId');
      expect(args[1]).to.eql({ articleId: 23 });
      expect(args[2]).to.eql({ for_admin: 'true' });
    };

    __util.__createFullUrl = mock;

    ffetch('/path/to/api/article/:articleId', {
      method: 'GET',
      params: { articleId: 23 },
      queries: { for_admin: 'true' },
    });

    __util.__createFullUrl = cached;
  });
});

describe('ffetch()', () => {
  describe('should stringify body and add a header when body is JSON', () => {
    [
      {
        input: {
          header: {
            accept: 'text/html, text/plain, application/json',
          },
          body: {
            foo: 'bar',
            baz: 'quz',
          },
        },
        output: {
          header: {
            accept: 'text/html, text/plain, application/json',
            'content-type': 'application/json',
          },
          body: '{"foo":"bar","baz":"quz"}',
        },
      },
      {
        input: {
          header: {},
          body: ['foo', 'bar', 'buz'],
        },
        output: {
          header: {
            'content-type': 'application/json',
          },
          body: '["foo","bar","buz"]',
        },
      },
      {
        input: {},
        output: {
          header: {},
          /* eslint-disable no-undefined */
          body: undefined,
          /* eslint-enable no-undefined */
        },
      },
    ].forEach(({ input, output }, i) => {
      it(`case ${i}`, done => {
        const cached = global.fetch;
        const mock = (url, options) => {
          expect(options.header).to.eql(output.header);
          expect(options.body).to.eql(output.body);
          done();
        };

        global.fetch = mock;

        ffetch('/path/to/api', {
          method: 'GET',
          header: input.header,
          body: input.body,
        });

        global.fetch = cached;
      });
    });
  });

  describe('should reject if timeout', () => {
    it('when options.timeout is given', function(done) {
      /* eslint-disable no-invalid-this */
      this.timeout(6000);
      /* eslint-enable no-invalid-this */

      const start = Date.now();
      const cached = global.fetch;
      const mock = (url, options) => {
        expect(options.timeout).to.be(5000);

        return new Promise(resolve => {
          setTimeout(resolve, 60000);
        });
      };

      global.fetch = mock;

      ffetch('/path/to/api', {
        method: 'GET',
        timeout: 5000,
      })
        .then(() => {
          expect().fail('must not called');
          done();
        })
        .catch(err => {
          expect(err.message).to.be('Session timeout');
          expect(Date.now() - start).to.greaterThan(4999);
          expect(Date.now() - start).to.lessThan(6000);
          done();
        });

      global.fetch = cached;
    });
  });
});
