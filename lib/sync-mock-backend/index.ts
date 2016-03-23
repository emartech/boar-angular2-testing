import { Response, ResponseOptions, RequestMethod } from 'angular2/http';
import { MockBackend, MockConnection } from 'angular2/http/testing';
import { Expectation, IExpectedRequest } from './expectation';

export class SyncMockBackend extends MockBackend {

  private _expectations: Expectation[] = [];
  private _pendingConnections: MockConnection[] = [];
  private _autoRespond = false;

  constructor({ autoRespond = false } = {}) {
    super();
    this._autoRespond = autoRespond;
    this.connections.subscribe((connection: MockConnection) => {
      this._pendingConnections = this._pendingConnections.concat(connection);
      if (this._autoRespond) this.flushNext();
    });
  }


  get autoRespond() {
    return this._autoRespond;
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
