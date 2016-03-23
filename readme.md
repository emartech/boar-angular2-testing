# Boar Angular2 Testing

This is an angular2 test helper collection.

Install
---------

```bash
npm install --save-dev boar-angular2-testing
```

How to provide
---------

```javascript
import { SyncMockBackend } from 'boar-angular2-testing';

beforEachProvider(() => {
  SyncMockBackend,
  provide(Http, {
    useFactory: (backend, defaultOptions) => {
      return new Http(backend, defaultOptions);
    },
    deps: [SyncMockBackend, BaseRequestOptions]
  })
});
```

Manual flush

---------

```javascript

const backend = new SyncMockBackend();
backend
  .whenGET('http://test.me/api/templates/abc123')
  .respondWithSuccess({ _id: 5, name: 'Test template' });
backend
  .whenDELETE('http://test.me/api/templates/abc123')
  .respondWithError('Something went wrong!'));
service.load();
backend.flushNext();
service.delete();
backend.flushNext();
```

Auto flush
---------

```javascript

const backend = new SyncMockBackend({ autoRespond: true });
backend
  .whenGET('http://test.me/api/templates/abc123')
  .respondWithSuccess({ _id: 5, name: 'Test template' });

service.load();
```

Verify No Pending Requests
---------

```javascript
const backend = new SyncMockBackend();
backend
  .whenGET('http://test.me/api/templates/abc123')
  .respondWithSuccess({ _id: 5, name: 'Test template' });
service.load();
backend.verifyNoPendingRequests();
```

It will throw an error because there is an unflushed request.


Verify No Expected Requests
---------
```javascript
const backend = new SyncMockBackend();
backend
  .whenGET('http://test.me/api/templates/abc123')
  .respondWithSuccess({ _id: 5, name: 'Test template' });
backend
  .whenDELETE('http://test.me/api/templates/abc123')
  .respondWithSuccess({ _id: 5, name: 'Test template' });
service.load();
backend.verifyNoExpectedRequests();
```

It will throw an error because there is an unused expectation. (DELETE)
