export class SyncMockBackendOptions {

  private _autoRespond: boolean;

  constructor({ autoRespond = false } = {}) {
    this._autoRespond = autoRespond;
  }


  get autoRespond() {
    return this._autoRespond;
  }

}
