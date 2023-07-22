import React from 'react';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { AppStage, initConfig } from '@cmctechnology/webinvest-store-frontend';
import { Provider } from 'react-redux';
import { Store } from '../store/Store';
import ChangeButton from './ChangeButton';
import { WfeButtonType } from '../constants/enums';
import { APP_STAGE } from '@cmctechnology/webinvest-constants';

/* istanbul ignore next */
const appStage = (process.env.REACT_APP_STAGE as AppStage) ?? APP_STAGE.Dev;
initConfig(appStage);

const WfeFRFlowChangeUsernameButton = () => {
  return (
    <Provider store={Store}>
      <ThemeProvider theme={themeCmcLight}>
        <BrowserRouter>
          <ChangeButton buttonType={WfeButtonType.ChangeUsername} />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default WfeFRFlowChangeUsernameButton;
