import { MockClassList } from './mock-class-list.ts';

export class MockElementRef {

  public nativeElement = {
    classList: new MockClassList()
  }

}
