import renderer, { ReactTestInstance } from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { themeCmcLight, ModalProvider } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { HelpButton } from './HelpButton';
import { ContactCard } from './ContactCard';

let tree: ReturnType<typeof renderer.create>;

beforeEach(() => {
  jest.resetAllMocks();
});

describe(`HelpButton`, () => {
  const ComponentToRender = () => (
    <ThemeProvider theme={themeCmcLight}>
      <ModalProvider />
      <HelpButton />
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should render without crashing`, () => {
      expect(() => renderer.create(<ComponentToRender />)).not.toThrow();
    });
  });

  describe(`open dialog`, () => {
    it(`should open contact card dialog`, () => {
      act(() => {
        tree = renderer.create(
          <div id='root-wrapper'>
            <ComponentToRender />
          </div>
        );
      });
      const helpButton = tree.root.findAllByType(HelpButton);
      expect(helpButton.length).toBe(1);
      expect(tree.root.findAllByType(ContactCard).length).toBe(0);

      act(() => {
        (helpButton[0].children[0] as ReactTestInstance).props.onClick();
      });

      expect(tree.root.findAllByType(ContactCard).length).toBe(1);
    });
  });
});
