import 'rxjs/add/operator/map'
import { expect } from 'chai';
import { SyncMockBackend } from './';
import { RequestMethod } from 'angular2/http';
import { Http, Response, ResponseOptions, BaseRequestOptions } from 'angular2/http';

const createHttp = (mockBackend: SyncMockBackend) => {
  return new Http(mockBackend, new BaseRequestOptions());
};

describe('Sync Mock Backend', () => {

  describe('#flushNext', () => {

    it('should respond with the given response if the url match', () => {
      const backend = new SyncMockBackend();
      const http = createHttp(backend);
      const dummyResponse = { 'yo': 'I am a json from the server ' };
      const URL = 'http://test.me.org/index.html';
      backend
        .whenGET(URL)
        .respondWithSuccess(dummyResponse);
      let response: any = null;
      http.get(URL).map((res) => res.json()).subscribe(r => response = r);
      backend.flushNext();
      expect(response).to.eql(dummyResponse);
    });


    it(`should thrown an error if the expected url doesn't match`, () => {
      const backend = new SyncMockBackend();
      const http = createHttp(backend);
      backend.whenGET('http://test.me.org/index.html').respondWithSuccess();
      expect(() => {
        http.get('http://other.adress.org/index.html').map((res) => res.json()).subscribe(() => {});
        backend.flushNext();
      }).to.throw(/Unexpected connection!/);
    });


    it('should thrown an error if there are no expected requests', () => {
      const backend = new SyncMockBackend();
      const http = createHttp(backend);
      const url = 'http://test.me.org/index.html';
      expect(() => {
        backend.flushNext();
      }).to.throw(/There is no pending request!/);
    });

  });

  describe('#verifyNoPendingRequests', () => {

    it('should not thrown an error if there are no pending request', () => {
      const backend = new SyncMockBackend();
      const http = createHttp(backend);
      const url = 'http://test.me.org/index.html';
      backend.whenGET(url).respondWithSuccess();
      http.get(url).map((res) => res.json()).subscribe(() => {});
      backend.flushNext();
      expect(() => {
        backend.verifyNoPendingRequests();
      }).to.not.throw();
    });


    it('should thrown an error if there are a pending request', () => {
      const backend = new SyncMockBackend();
      const http = createHttp(backend);
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
      const backend = new SyncMockBackend();
      const http = createHttp(backend);
      const url = 'http://test.me.org/index.html';
      backend.whenGET(url).respondWithSuccess();
      http.get(url).map((res) => res.json()).subscribe(() => {});
      backend.flushNext();
      expect(() => {
        backend.verifyNoExpectedRequests();
      }).to.not.throw();
    });


    it('should thrown an error if there is an unfullfiled request', () => {
      const backend = new SyncMockBackend();
      const http = createHttp(backend);
      const url = 'http://test.me.org/index.html';
      backend.whenGET(url).respondWithSuccess();
      expect(() => {
        backend.verifyNoExpectedRequests();
      }).to.throw(/There is an unfulfilled request./);
    });

  });

});
