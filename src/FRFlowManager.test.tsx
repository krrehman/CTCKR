import renderer from 'react-test-renderer';
import FRFlowManager from './FRFlowManager';
import { Provider } from 'react-redux';
import { Store } from './store/Store';
import { ThemeProvider } from 'styled-components';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

describe(`FRFlowManager`, () => {
  it(`should match snapshot`, () => {
    const tree = renderer.create(
      <Provider store={Store}>
        <ThemeProvider theme={themeCmcLight}>
          <HelmetProvider>
            <BrowserRouter>
              <FRFlowManager />
            </BrowserRouter>
          </HelmetProvider>
        </ThemeProvider>
      </Provider>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
