import renderer from 'react-test-renderer';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { Store } from '../store/Store';
import { ForgotUsername } from './ForgotUsername';

describe(`ForgotUsernamePage`, () => {
  const ComponentToRender = () => (
    <Provider store={Store}>
      <ThemeProvider theme={themeCmcLight}>
        <ForgotUsername onNext={jest.fn()} onInterceptorsRequired={jest.fn()} />
      </ThemeProvider>
    </Provider>
  );

  it(`should match snapshot`, () => {
    expect(renderer.create(<ComponentToRender />).toJSON()).toMatchSnapshot();
  });
});
