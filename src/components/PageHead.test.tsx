import renderer from 'react-test-renderer';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { Page } from '@cmctechnology/webinvest-store-client';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from 'styled-components';
import { PageHead } from './PageHead';
import { pages } from '../constants/pageConstants';

jest.mock(`@cmctechnology/phoenix-stockbroking-web-design`, () => ({
  ...jest.requireActual(`@cmctechnology/phoenix-stockbroking-web-design`),
  useModalState: jest.fn()
}));

describe(`PageHead`, () => {
  const ComponentToRender = () => (
    <ThemeProvider theme={themeCmcLight}>
      <HelmetProvider>
        <PageHead page={pages[Page.LogIn]} />
      </HelmetProvider>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should render without crashing`, () => {
      expect(() => renderer.create(<ComponentToRender />)).not.toThrow();
    });
  });
});
