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
    it('should return an instance that method is GET', () => {
      const ea = EasyAgent.get('url');

      expect(ea.method).to.be('GET');
    });
  });

  describe('EasyAgent.post()', () => {
    it('should return an instance that method is POST', () => {
      const ea = EasyAgent.post('url');

      expect(ea.method).to.be('POST');
    });
  });

  describe('EasyAgent.put()', () => {
    it('should return an instance that method is PUT', () => {
      const ea = EasyAgent.put('url');

      expect(ea.method).to.be('PUT');
    });
  });

  describe('EasyAgent.del()', () => {
    it('should return an instance that method is DELETE', () => {
      const ea = EasyAgent.del('url');

      expect(ea.method).to.be('DELETE');
    });
  });

  describe('EasyAgent.head()', () => {
    it('should return an instance that method is HEAD', () => {
      const ea = EasyAgent.head('url');

      expect(ea.method).to.be('HEAD');
    });
  });

  describe('EasyAgent.opt()', () => {
    it('should return an instance that method is OPTIONS', () => {
      const ea = EasyAgent.opt('url');

      expect(ea.method).to.be('OPTIONS');
    });
  });

  describe('EasyAgent#setUrl()', () => {
    it('should return an instance that url is changed', () => {
      expect(
        EasyAgent.get('http://first.url')
          .setUrl('http://second.url')
          .url
      ).to.be('http://second.url');

      expect(
        EasyAgent.get('http://first.url')
          .setUrl('http://second.url')
          .setUrl('http://third.url')
          .url
      ).to.be('http://third.url');
    });

    it('should return an instance that is another reference', () => {
      const ea      = EasyAgent.get('http://first.url');
      const another = ea.setUrl('http://second.url');

      expect(ea).to.not.be(another);
      expect(ea.url).to.be('http://first.url');
      expect(another.url).to.be('http://second.url');
    });
  });

  describe('EasyAgent#setMethod()', () => {
    it('should return an instance that method is changed', () => {
      expect(
        EasyAgent.get('http://first.url')
          .setMethod('POST')
          .method
      ).to.be('POST');

      expect(
        EasyAgent.get('http://first.url')
          .setMethod('POST')
          .setMethod('PUT')
          .method
      ).to.be('PUT');
    });

    it('should return an instance that is another reference', () => {
      const ea      = EasyAgent.get('http://first.url');
      const another = ea.setMethod('POST');

      expect(ea).to.not.be(another);
      expect(ea.method).to.be('GET');
      expect(another.method).to.be('POST');
    });

    it('should convert method to upper case', () => {
      expect(
        EasyAgent.get('http://first.url')
          .setMethod('delete')
          .method
      ).to.be('DELETE');
    });
  });

  describe
});
