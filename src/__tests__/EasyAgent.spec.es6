import expect from 'expect.js';

import EasyAgent from '../EasyAgent';

describe('EasyAgent', () => {
  describe('Initialize', () => {
    it('should throw an error when window.fetch is not a function', () => {
      const ea = EasyAgent.get('url');
      const f = ea.fetch.bind(ea);

      expect(f).to.be.throwError(err => {
        expect(err).to.be.a(ReferenceError);
      });
    });
  });

  describe('EasyAgent.get()', () => {
    it('should return an instance of EasyAgent that method is GET', () => {
      const ea = EasyAgent.get('url');

      expect(ea.method).to.be('GET');
    });
  });

  describe('EasyAgent.post()', () => {
    it('should return an instance of EasyAgent that method is POST', () => {
      const ea = EasyAgent.post('url');

      expect(ea.method).to.be('POST');
    });
  });

  describe('EasyAgent.put()', () => {
    it('should return an instance of EasyAgent that method is PUT', () => {
      const ea = EasyAgent.put('url');

      expect(ea.method).to.be('PUT');
    });
  });

  describe('EasyAgent.del()', () => {
    it('should return an instance of EasyAgent that method is DELETE', () => {
      const ea = EasyAgent.del('url');

      expect(ea.method).to.be('DELETE');
    });
  });

  describe('EasyAgent.head()', () => {
    it('should return an instance of EasyAgent that method is HEAD', () => {
      const ea = EasyAgent.head('url');

      expect(ea.method).to.be('HEAD');
    });
  });

  describe('EasyAgent.opt()', () => {
    it('should return an instance of EasyAgent that method is OPTIONS', () => {
      const ea = EasyAgent.opt('url');

      expect(ea.method).to.be('OPTIONS');
    });
  });
});
