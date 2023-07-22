import React from 'react';
import { ModalProvider, themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { Store } from '../store/Store';
import { BrowserRouter } from 'react-router-dom';

const WfeModalProvider: React.FC = () => {
  return (
    <Provider store={Store}>
      <ThemeProvider theme={themeCmcLight}>
        <BrowserRouter>
          <ModalProvider />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default WfeModalProvider;
