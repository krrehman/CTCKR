import React from 'react';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { BrowserRouter } from 'react-router-dom';
import { initConfig } from '@cmctechnology/webinvest-store-frontend';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { Store } from '../store/Store';
import EnableDisableMfaContainer from './EnableDisableMfaContainer';
import { WfeButtonType } from '../constants/enums';
import { APP_STAGE, AppStage } from '@cmctechnology/webinvest-constants';

interface IWfeFRFlowEnableDisableMfaContainerProps {
  enabled: boolean;
}

/* istanbul ignore next */
const appStage = (process.env.REACT_APP_STAGE as AppStage) ?? APP_STAGE.Dev;
initConfig(appStage);

const WfeFRFlowEnableDisableMfaContainer: React.FC<IWfeFRFlowEnableDisableMfaContainerProps> = ({ enabled }) => {
  return (
    <Provider store={Store}>
      <ThemeProvider theme={themeCmcLight}>
        <BrowserRouter>
          <EnableDisableMfaContainer buttonType={enabled ? WfeButtonType.DisableMFA : WfeButtonType.EnableMFA} />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default WfeFRFlowEnableDisableMfaContainer;
