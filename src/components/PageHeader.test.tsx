import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { themeCmcLight, Button } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { PageHeader } from './PageHeader';
import { CMC_MARKETS_WEBSITE_URL, ONBOARDING_START_URL } from '../constants/urlConstants';

let tree: ReturnType<typeof renderer.create>;

beforeEach(() => {
  jest.resetAllMocks();
});

describe(`PageHeader`, () => {
  const ComponentToRender = () => (
    <ThemeProvider theme={themeCmcLight}>
      <PageHeader />
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should render without crashing`, () => {
      expect(() => renderer.create(<ComponentToRender />)).not.toThrow();
    });
  });

  describe(`click handlers`, () => {
    it(`should set window.location.href, when GoToWebsiteButton is clicked`, () => {
      const openMock = jest.fn();

      window.open = openMock;
      act(() => {
        tree = renderer.create(<ComponentToRender />);
      });
      const buttons = tree.root.findByType(PageHeader).findAllByType(Button);
      expect(buttons.length).toBe(2);

      const goToWebsiteButton = buttons[0];
      act(() => {
        goToWebsiteButton.props.onClick();
      });
      expect(openMock.mock.calls.length).toBe(1);
      expect(openMock.mock.calls[0][0]).toEqual(CMC_MARKETS_WEBSITE_URL);
    });

    it(`should window.location.href, when CreateAccountButton is clicked`, () => {
      const openMock = jest.fn();

      window.open = openMock;
      act(() => {
        tree = renderer.create(<ComponentToRender />);
      });
      const buttons = tree.root.findByType(PageHeader).findAllByType(Button);
      expect(buttons.length).toBe(2);

      const applyNowButton = buttons[1];
      act(() => {
        applyNowButton.props.onClick();
      });
      expect(openMock.mock.calls[0][0]).toEqual(ONBOARDING_START_URL);
    });
  });
});
