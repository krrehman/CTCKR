import renderer from 'react-test-renderer';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { Store } from '../store/Store';
import DisableMfa from './DisableMfa';

describe(`DisableMfa`, () => {
  const ComponentToRender = () => (
    <Provider store={Store}>
      <ThemeProvider theme={themeCmcLight}>
        <DisableMfa onNext={jest.fn()} />
      </ThemeProvider>
    </Provider>
  );

  it(`should match snapshot`, () => {
    expect(renderer.create(<ComponentToRender />).toJSON()).toMatchSnapshot();
  });
});
