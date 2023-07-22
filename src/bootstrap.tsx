import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { APP_STAGE, THEMES, AppStage } from '@cmctechnology/webinvest-constants';
import { FrontendContextProvider, getConfig, initConfig } from '@cmctechnology/webinvest-store-frontend';
import { HelmetProvider } from 'react-helmet-async';
import i18n from 'i18next';
import backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { Store } from './store/Store';
import { themeCmcLight, ModalProvider } from '@cmctechnology/phoenix-stockbroking-web-design';
import './initialiseModuleConfig';
import FRFlowManager from './FRFlowManager';

const DEFAULT_LANGUAGE = 'en';

const i18nBackendLoadPath = `${process.env.PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`;
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(backend)
  .init({
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    nsSeparator: '::',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    },
    backend: {
      loadPath: i18nBackendLoadPath
    }
  });

const currentEnv = (process.env.REACT_APP_STAGE as AppStage) ?? APP_STAGE.Dev;
initConfig(currentEnv);

const container = document.querySelector(`#root`);
const root = createRoot(container!);
root.render(
  <FrontendContextProvider
    tradingRoutePrefix={`${process.env.PUBLIC_URL}/trading`}
    publicUrl={`${process.env.PUBLIC_URL}`}
    config={getConfig()}
    theme={THEMES.CMCSingapore}
  >
    <Provider store={Store}>
      <ThemeProvider theme={themeCmcLight}>
        <HelmetProvider>
          <BrowserRouter>
            <ModalProvider />
            <Routes>
              <Route path={`${process.env.PUBLIC_URL}/*`} element={<FRFlowManager />} />
            </Routes>
          </BrowserRouter>
        </HelmetProvider>
      </ThemeProvider>
    </Provider>
  </FrontendContextProvider>
);
