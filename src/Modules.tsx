import { moduleMemoFactory } from '@cmctechnology/webinvest-module';
import { ILoginInterceptorProps } from './pages/LoginInterceptor';

export const InterceptorManager = moduleMemoFactory<ILoginInterceptorProps>({
  appName: `webinvest-module-login-interceptors`,
  moduleName: `./InterceptorManager`
});
