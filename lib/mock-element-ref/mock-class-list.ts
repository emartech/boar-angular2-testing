export class MockClassList {

  private _classes: string[] = [];

  get classList() {
    return this._classes;
  }


  add(classToAdd: string) {
    this._classes = this._classes.concat(classToAdd);
  }


  remove(classToRemove: string) {
    this._classes = this._classes.filter(clazz => clazz !== classToRemove);
  }


  hasClass(classToCheck: string) {
    return !!this._classes.find(clazz => clazz === classToCheck);
  }

}
