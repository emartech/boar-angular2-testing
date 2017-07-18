import { RequestMethod } from '@angular/http';
import { MockConnection } from '@angular/http/testing';

export interface IExpectedRequest {
  method?: RequestMethod;
  url?: string;
  body?: any;
}

export class Expectation {

  private _expectedRequest: IExpectedRequest;
  private _response: any;
  private _responseCode: number;
  private _errorResponse: any;

  constructor(expectedRequest: IExpectedRequest = {}) {
    this._expectedRequest = expectedRequest;
  }


  get response() {
    return this._response;
  }


  get responseCode() {
    return this._responseCode;
  }


  get errorResponse() {
    return this._errorResponse;
  }


  respondWith({ body = null, status = 200 }: { body: any, status: number}) {
    this._response = body;
    this._responseCode = status;
  }


  respondWithSuccess(response: any = null) {
    this._response = response;
  }


  respondWithError(error: any = 'Something went wrong!') {
    this._errorResponse = error;
  }


  match(connection: MockConnection): boolean {
    return this._matchMethod(connection) && this._matchUrl(connection) && this._matchBody(connection);
  }


  _matchMethod(connection: MockConnection): boolean {
    return !this._expectedRequest.method || connection.request.method === this._expectedRequest.method;
  }


  _matchUrl(connection: MockConnection): boolean {
    return !this._expectedRequest.url || connection.request.url === this._expectedRequest.url;
  }


  _matchBody(connection: MockConnection): boolean {
    if (!this._expectedRequest.body) return true;
    return connection.request.text() === JSON.stringify(this._expectedRequest.body);
  }

}
