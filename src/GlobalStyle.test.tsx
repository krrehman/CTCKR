import renderer from 'react-test-renderer';
import { GlobalStyle } from './GlobalStyle';

describe(`GlobalStyle`, () => {
  it(`should match snapshot`, () => {
    const tree = renderer.create(<GlobalStyle />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
