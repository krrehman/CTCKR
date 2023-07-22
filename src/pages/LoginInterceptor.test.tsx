import renderer from 'react-test-renderer';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { Store } from '../store/Store';
import { ILoginInterceptorProps, LoginInterceptor } from './LoginInterceptor';
import React from 'react';

const mockLoginInterceptorProps = {
  username: `some-user`,
  password: `some-pass`,
  interceptors: [],
  onLogin: jest.fn()
};

const MockInterceptor: React.FC<ILoginInterceptorProps> = (props): JSX.Element => {
  const { username, password } = props;
  return (
    <div id={`login-module-intercpetor`}>
      Mock Login Module Interceptor for user: {username}, password: {password}{' '}
    </div>
  );
};

jest.mock(`../Modules`, () => ({
  ...jest.requireActual(`../Modules`),
  InterceptorManager: () => <MockInterceptor {...mockLoginInterceptorProps} />
}));

describe(`LoginInterceptorPage`, () => {
  const ComponentToRender = () => (
    <Provider store={Store}>
      <ThemeProvider theme={themeCmcLight}>
        <LoginInterceptor {...mockLoginInterceptorProps} />
      </ThemeProvider>
    </Provider>
  );

  it(`should render without crashing`, () => {
    expect(() => renderer.create(<ComponentToRender />)).not.toThrow();
  });
});
