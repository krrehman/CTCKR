import React, { useState } from 'react';
import { Routes, Route, Navigate, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
import { Login } from './pages/Login';
import { Page, getOAuth, CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { PageBase } from './pages/PageBase';
import { pages } from './constants/pageConstants';
import { ILoginInterceptorProps, LoginInterceptor } from './pages/LoginInterceptor';
import { ForgotPassword } from './pages/ForgotPassword';
import { ForgotUsername } from './pages/ForgotUsername';

// the fr token provided to call onprem auth is short lived (1 min).
// if passing interceptors taking more than 1 min. the login process fails.
// passing callback to interceptors module to acquire new tokens.
export const reacquireTokens = async () => {
  await getOAuth();
  const tokens: CMCFRSDK.Tokens = await CMCFRSDK.TokenStorage.get();
  return tokens;
};

export const FRRoutes: React.FC = () => {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get(`redirect_url`);
  const [interceptorProps, setInterceptorProps] = useState<ILoginInterceptorProps>({} as ILoginInterceptorProps);
  const navigate = useNavigate();

  const redirectHandler = (newPage: Page) => {
    const search =
      (redirectUrl &&
        `?${createSearchParams({
          redirect_url: redirectUrl
        })}`) ||
      ``;
    navigate({ pathname: pages[newPage].path, search });
  };

  const loginSuccessHandler = () => {
    // When navigating to '/', will be picked up by webinvest-frontend
    // router and redirected to /trading.
    const url = redirectUrl || `/`;
    navigate({ pathname: url });
  };

  return (
    <Routes>
      <Route index path='/' element={<Navigate to='../login' />} />
      <Route
        {...pages[Page.LogIn]}
        element={
          <PageBase {...pages[Page.LogIn]}>
            <Login
              onNext={loginSuccessHandler}
              onInterceptorsRequired={(props: ILoginInterceptorProps) => {
                setInterceptorProps({ ...props, onLogin: loginSuccessHandler, refreshTokenCallback: reacquireTokens });
                redirectHandler(Page.LoginInterceptors);
              }}
            />
          </PageBase>
        }
      />
      <Route
        {...pages[Page.ForgotPassword]}
        element={
          <PageBase {...pages[Page.ForgotPassword]}>
            <ForgotPassword
              onNext={loginSuccessHandler}
              onInterceptorsRequired={(props: ILoginInterceptorProps) => {
                setInterceptorProps({ ...props, onLogin: loginSuccessHandler, refreshTokenCallback: reacquireTokens });
                redirectHandler(Page.LoginInterceptors);
              }}
            />
          </PageBase>
        }
      />
      <Route
        {...pages[Page.ForgotUsername]}
        element={
          <PageBase {...pages[Page.ForgotUsername]}>
            <ForgotUsername
              onNext={loginSuccessHandler}
              onInterceptorsRequired={(props: ILoginInterceptorProps) => {
                setInterceptorProps({ ...props, onLogin: loginSuccessHandler, refreshTokenCallback: reacquireTokens });
                redirectHandler(Page.LoginInterceptors);
              }}
            />
          </PageBase>
        }
      />
      <Route
        {...pages[Page.LoginInterceptors]}
        element={
          <PageBase {...pages[Page.LoginInterceptors]}>
            <LoginInterceptor {...interceptorProps} />
          </PageBase>
        }
      />
    </Routes>
  );
};
