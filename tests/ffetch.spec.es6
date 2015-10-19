/* eslint max-nested-callbacks: 0  */

// ヘッダーのキーの小文字化
// JSONのパース
// ショートハンド

import { __util } from '../sources/ffetch';

describe('__createFullUrl()', () => {
  describe('should generating a full url using base, param and query', () => {
    [
      {
        base: '/path/to/api/page/:page',
        param: { page: 1 },
        query: { order: ['published_at', 'id'], filter: 'open' },
        joined: '/path/to/api/page/1?order=published_at&order=id&filter=open',
      },
      {
        base: '/path/to/api/article/:articleId/comment/:commentId',
        param: { articleId: 23, commentId: 1045 },
        query: { for_admin: 'true' },
        joined: '/path/to/api/article/23/comment/1045?for_admin=true',
      },
      {
        base: '/path/to/api/article/:articleId/comment/:commentId',
        param: { articleId: 23, commentId: 1045 },
        query: {},
        joined: '/path/to/api/article/23/comment/1045',
      },
      {
        base: '/path/to/api',
        param: {},
        query: { order: ['published_at', 'id'], filter: 'open' },
        joined: '/path/to/api?order=published_at&order=id&filter=open',
      },
      {
        base: '/path/to/api',
        param: {},
        query: {},
        joined: '/path/to/api',
      },
      {
        base: '/path/to/api',
        /* eslint-disable no-undefined */
        param: undefined,
        query: undefined,
        /* eslint-enable no-undefined */
        joined: '/path/to/api',
      },
    ].forEach(({ base, param, query, joined }, i) => {
      it(`case ${i}`, () => {
        expect(__util.__createFullUrl(base, param, query)).to.be(joined);
      });
    });
  });
});
