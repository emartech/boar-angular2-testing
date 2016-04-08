import { Response, ResponseOptions } from 'angular2/http';

export class ResponseFactory {

  createSuccess({
    status = 200,
    message = {}
  } = {}) {
    return this._create({ status, message });
  }


  createError({
    status = 400,
    message = 'Something went wrong!'
  } = {}) {
    return this._create({ status, message });
  }


  _create({ status, message }) {
    return new Response(new ResponseOptions({
      body: { message },
      status
    }));
  }

}
