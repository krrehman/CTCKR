import renderer from 'react-test-renderer';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { Page } from '@cmctechnology/webinvest-store-client';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from 'styled-components';
import { PageBase } from './PageBase';
import { pages } from '../constants/pageConstants';

describe(`PageBase`, () => {
  const ComponentToRender = () => (
    <ThemeProvider theme={themeCmcLight}>
      <HelmetProvider>
        <PageBase {...pages[Page.ForgotPassword]} />
      </HelmetProvider>
    </ThemeProvider>
  );

  it(`should render without crashing`, () => {
    expect(() => renderer.create(<ComponentToRender />)).not.toThrow();
  });
});
