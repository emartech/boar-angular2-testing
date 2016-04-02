import 'rxjs/add/operator/map'
import { expect } from 'chai';
import { MockElementRef } from './';

const create = ({
  classes = []
} = {}) => {
  const element = new MockElementRef();
  classes.forEach(clazz => element.nativeElement.classList.add(clazz));
  return element;
};

describe('Mock Element Ref', () => {

  describe('@nativeElement', () => {

    describe('@classList', () => {

      describe('#add', () => {

        it('should add class to the element', () => {
          const element = create();
          element.nativeElement.classList.add('test-class');
          expect(element.nativeElement.classList.hasClass('test-class')).to.be.true;
        });

      });

      describe('#remove', () => {

        it('should remove class from the element', () => {
          const element = create(['test-class', 'other-class', 'third-class']);
          element.nativeElement.classList.remove('other-class');
          expect(element.nativeElement.classList.hasClass('other-class')).to.be.false;
        });

      });

    });

  });

});
