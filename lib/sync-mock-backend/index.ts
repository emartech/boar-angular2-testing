import { Response, ResponseOptions, RequestMethod, Request } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Expectation, IExpectedRequest } from './expectation';
import { SyncMockBackendOptions } from './options';
export { SyncMockBackendOptions } from './options';
export { Expectation } from './expectation';
import { Injectable } from '@angular/core';

@Injectable()
export class SyncMockBackend extends MockBackend {

  private _expectations: Expectation[] = [];
  private _pendingConnections: MockConnection[] = [];
  private _options: SyncMockBackendOptions;
  private _lastRequest: Request;

  constructor(options: SyncMockBackendOptions = new SyncMockBackendOptions()) {
    super();
    this._options = options;
    this.connections.subscribe((connection: MockConnection) => {
      this._pendingConnections = this._pendingConnections.concat(connection);
      if (this._options.autoRespond) this.flushNext();
    });
  }


  static createWithAutoRespond(expectation?: Expectation) {
    const backend = new SyncMockBackend(new SyncMockBackendOptions({ autoRespond: true }));
    if (expectation) backend.prependExpectation(expectation);
    return backend;
  }


  get lastRequest() {
    return this._lastRequest;
  }


  get autoRespond() {
    return this._options.autoRespond;
  }


  every() {
    const expectation = new Expectation();
    this._appendExpectation(expectation);
    return expectation;
  }


  when(expectedrequest: IExpectedRequest = {}) {
    const expectation = new Expectation(expectedrequest);
    this._appendExpectation(expectation);
    return expectation;
  }


  whenGET(url: string = null) {
    const expectation = new Expectation({ url, method: RequestMethod.Get });
    this._appendExpectation(expectation);
    return expectation;
  }


  whenPOST(url: string = null, body: any = null) {
    const expectation = new Expectation({ url, body, method: RequestMethod.Post });
    this._appendExpectation(expectation);
    return expectation;
  }


  whenDELETE(url: string = null) {
    const expectation = new Expectation({ url, method: RequestMethod.Delete });
    this._appendExpectation(expectation);
    return expectation;
  }


  whenPUT(url: string = null, body: any = null) {
    const expectation = new Expectation({ url, body, method: RequestMethod.Put });
    this._appendExpectation(expectation);
    return expectation;
  }


  whenPATCH(url: string = null, body: any = null) {
    const expectation = new Expectation({ url, body, method: RequestMethod.Patch });
    this._appendExpectation(expectation);
    return expectation;
  }


  prependWhen(expectedrequest: IExpectedRequest = {}) {
    const expectation = new Expectation(expectedrequest);
    this._expectations = [expectation].concat(this._expectations);
    return expectation;
  }


  prependExpectation(expectation: Expectation) {
    this._expectations = [expectation].concat(this._expectations);
  }


  appendExpectation(expectation: Expectation) {
    this._expectations = this._expectations.concat(expectation);
  }


  flushAll() {
    if (!this._pendingConnections.length) throw new Error('There is no pending request!');
    this._pendingConnections.forEach((connection) => this._flush(connection));
  }


  flushNext() {
    if (!this._pendingConnections.length) throw new Error('There is no pending request!');
    this._flush(this._pendingConnections[0]);
  }


  clear() {
    this._expectations = [];
    this._pendingConnections = [];
  }


  verify() {
    this.verifyNoExpectedRequests();
    this.verifyNoPendingRequests();
  }


  verifyNoPendingRequests() {
    if (this._pendingConnections.length > 0) {
      const firstPendingConncetions = this._pendingConnections[0];
      const connectionDetails = `${firstPendingConncetions.request.method} ${firstPendingConncetions.request.url}`;
      throw new Error(`There is an ongoing request. ${connectionDetails}`);
    }
  }


  verifyNoExpectedRequests() {
    if (this._expectations.length > 0) {
      throw new Error(`There is an unfulfilled request.`);
    }
  }


  _appendExpectation(expectation: Expectation) {
    this._expectations = this._expectations.concat(expectation);
  }


  _flush(connectionToFlush: MockConnection) {
    if (this._expectations.length === 0) throw this._unexpectedConnectionError(connectionToFlush);
    const nextExpectation = this._expectations[0];
    if (!nextExpectation.match(connectionToFlush)) throw this._unexpectedConnectionError(connectionToFlush);
    this._lastRequest = connectionToFlush.request;
    if (nextExpectation.errorResponse) {
      connectionToFlush.mockError(nextExpectation.errorResponse);
    } else {
      connectionToFlush.mockRespond(new Response(new ResponseOptions({ body: nextExpectation.response })));
    }
    this._pendingConnections = this._pendingConnections.filter(connection => connectionToFlush !== connection);
    this._expectations = this._expectations.filter(expectation => expectation !== nextExpectation);
  }


  _unexpectedConnectionError(connection: MockConnection) {
    return new Error(`Unexpected connection! ${connection.request.method} ${connection.request.url}`);
  }

}
