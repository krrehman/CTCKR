import { moduleConfigBaseUrlNonProd, registerModuleBaseUrl } from '@cmctechnology/webinvest-module';

if (process.env.REACT_APP_USE_NONPROD_MODULE_URL) {
  registerModuleBaseUrl(moduleConfigBaseUrlNonProd);
}
