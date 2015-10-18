/* eslint max-nested-callbacks: 0  */

// URLのパース
// ヘッダーのキーの小文字化
// JSONのパース
// ショートハンド

import { createFullUrl } from '../sources/ffetch';

describe('createFullUrl()', () => {
  describe('should generating a full url using base, param and query', () => {
    [
      {
        base: '/path/to/api/page/:page',
        param: { page: 1 },
        query: { order: ['published_at', 'id'], filter: 'open' },
        joined: '/path/to/api/page/1?order=published_at&order=id&filter=open',
      },
    ].forEach(({ base, param, query, joined }, i) => {
      it(`case ${i}`, () => {
        expect(createFullUrl(base, param, query)).to.be(joined);
      });
    });
  });
});
