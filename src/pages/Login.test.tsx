import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { Login } from './Login';
import { Provider } from 'react-redux';
import { Store } from '../store/Store';

describe(`LoginPage`, () => {
  const ComponentToRender = () => (
    <Provider store={Store}>
      <ThemeProvider theme={themeCmcLight}>
        <BrowserRouter>
          <Login onNext={jest.fn()} onInterceptorsRequired={jest.fn()} />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );

  it(`should match snapshot`, () => {
    expect(renderer.create(<ComponentToRender />).toJSON()).toMatchSnapshot();
  });
});
