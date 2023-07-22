import renderer from 'react-test-renderer';
import WfeModalProvider from './WfeModalProvider';

describe(`WfeModalProvider`, () => {
  it(`should match snapshot`, () => {
    expect(renderer.create(<WfeModalProvider />).toJSON()).toMatchSnapshot();
  });
});
