import { createClientStore, defaultClientStore, CLIENT_STORE_NAME } from '@cmctechnology/webinvest-store-client';
import { createFrontendStore, defaultFrontendStore, FRONTEND_STORE_NAME } from '@cmctechnology/webinvest-store-frontend';
import { configureStore } from '@reduxjs/toolkit';

const clientStore = createClientStore(defaultClientStore);
const frontendStore = createFrontendStore(defaultFrontendStore);

export const Store = configureStore({
  reducer: {
    [CLIENT_STORE_NAME]: clientStore.reducer,
    [FRONTEND_STORE_NAME]: frontendStore.reducer
  }
});

export type IStore = ReturnType<typeof Store.getState>;

declare module 'react-redux' {
  interface DefaultRootState extends IStore {}
}
