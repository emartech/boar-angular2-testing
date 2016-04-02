import { MockClassList } from './mock-class-list';

export class MockElementRef {

  public nativeElement = {
    classList: new MockClassList()
  }

}
