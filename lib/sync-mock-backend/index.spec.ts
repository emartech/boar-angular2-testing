import 'rxjs/add/operator/map'
import { expect } from 'chai';
import { SyncMockBackend, SyncMockBackendOptions } from './';
import { RequestMethod } from 'angular2/http';
import { Http, Response, ResponseOptions, BaseRequestOptions } from 'angular2/http';

const createModule = (syncMockBackendOptions = new SyncMockBackendOptions()) => {
  const backend = new SyncMockBackend(syncMockBackendOptions);
  const http =  new Http(backend, new BaseRequestOptions());
  return { backend, http };
};

describe('Sync Mock Backend', () => {

  describe('with autoRespond', () => {

    it('should respond automatically after the connection arrives', () => {
      const { backend, http } = createModule(new SyncMockBackendOptions({ autoRespond: true }));
      backend.every().respondWithSuccess();
      let called = false;
      http.get('http://fake.me').map((res) => res.json()).subscribe(() => called = true);
      expect(called).to.be.true;
    });

  });

  describe('without autoRespond', () => {

    it('should not respond automatically if the connection arrives', () => {
      const { backend, http } = createModule();
      backend.every().respondWithSuccess();
      let called = false;
      http.get('http://fake.me').map((res) => res.json()).subscribe(() => called = true);
      expect(called).to.be.false;
    });

  });

  describe('@autoRespond', () => {

    it('should be false by default', () => {
      const backend = new SyncMockBackend();
      expect(backend.autoRespond).to.be.false;
    });


    it('should be true if set via options', () => {
      const backend = new SyncMockBackend(new SyncMockBackendOptions({ autoRespond: true }));
      expect(backend.autoRespond).to.be.true;
    });

  });

  describe('#flushNext', () => {

    it('should respond with the given response if the url match', () => {
      const { backend, http } = createModule();
      const dummyResponse = { 'yo': 'I am a json from the server ' };
      const URL = 'http://test.me.org/index.html';
      backend.whenGET(URL).respondWithSuccess(dummyResponse);
      let response: any = null;
      http.get(URL).map((res) => res.json()).subscribe(r => response = r);
      backend.flushNext();
      expect(response).to.eql(dummyResponse);
    });


    it(`should thrown an error if the expected url doesn't match`, () => {
      const { backend, http } = createModule();
      backend.whenGET('http://test.me.org/index.html').respondWithSuccess();
      expect(() => {
        http.get('http://other.adress.org/index.html').map((res) => res.json()).subscribe(() => {});
        backend.flushNext();
      }).to.throw(/Unexpected connection!/);
    });


    it('should thrown an error if there are no expected requests', () => {
      const { backend, http } = createModule();
      const url = 'http://test.me.org/index.html';
      expect(() => {
        backend.flushNext();
      }).to.throw(/There is no pending request!/);
    });

  });

  describe('#flushAll', () => {

    it('should flush every pending request', () => {
      const { backend, http } = createModule();
      const firstResponse = { 'yo': 'I am a json from the server' };
      const secondResponse = { 'yo': 'I am an other json from the server' };
      const firstRequestURL = 'http://test.me.org/index.html';
      const secondRequestURL = 'http://test.me.org/index.html';
      backend.whenGET(firstRequestURL).respondWithSuccess(firstResponse);
      backend.whenGET(secondRequestURL).respondWithSuccess(secondResponse);
      let response: any = null;
      http.get(firstRequestURL).map((res) => res.json()).subscribe(r => response = r);
      backend.flushNext();
      expect(response).to.eql(firstResponse);
      http.get(secondRequestURL).map((res) => res.json()).subscribe(r => response = r);
      backend.flushNext();
      expect(response).to.eql(secondResponse);
    });

  });

  describe('#verifyNoPendingRequests', () => {

    it('should not thrown an error if there are no pending request', () => {
      const { backend, http } = createModule();
      const url = 'http://test.me.org/index.html';
      backend.whenGET(url).respondWithSuccess();
      http.get(url).map((res) => res.json()).subscribe(() => {});
      backend.flushNext();
      expect(() => {
        backend.verifyNoPendingRequests();
      }).to.not.throw();
    });


    it('should thrown an error if there are a pending request', () => {
      const { backend, http } = createModule();
      const url = 'http://test.me.org/index.html';
      backend.whenGET(url).respondWithSuccess();
      http.get(url).map((res) => res.json()).subscribe(() => {});
      expect(() => {
        backend.verifyNoPendingRequests();
      }).to.throw(/There is an ongoing request./);
    });

  });

  describe('#verifyNoExpectedRequests', () => {

    it('should not thrown an error if there every request fullfilled', () => {
      const { backend, http } = createModule();
      const url = 'http://test.me.org/index.html';
      backend.whenGET(url).respondWithSuccess();
      http.get(url).map((res) => res.json()).subscribe(() => {});
      backend.flushNext();
      expect(() => {
        backend.verifyNoExpectedRequests();
      }).to.not.throw();
    });


    it('should thrown an error if there is an unfullfiled request', () => {
      const { backend, http } = createModule();
      const url = 'http://test.me.org/index.html';
      backend.whenGET(url).respondWithSuccess();
      expect(() => {
        backend.verifyNoExpectedRequests();
      }).to.throw(/There is an unfulfilled request./);
    });

  });

});
