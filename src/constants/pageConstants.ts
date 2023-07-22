import { Page } from '@cmctechnology/webinvest-store-client';
import { IPage } from '../models/page';

export const pageConstants = {
  defaultTitle: (t: any) => t(`CMC Markets Invest`)
};

export const pages: Record<Page, IPage> = {
  [Page.LogIn]: {
    path: `login`,
    public: true
  },
  [Page.ForgotPassword]: {
    path: `forgot-password`,
    public: true
  },
  [Page.ForgotUsername]: {
    path: `forgot-username`,
    public: true
  },
  [Page.LoginInterceptors]: {
    path: `intercept-login`,
    public: true
  }
};
