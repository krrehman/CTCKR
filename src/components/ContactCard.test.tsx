import renderer from 'react-test-renderer';
import { themeCmcLight, useModalState, IModalState } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { act } from 'react-dom/test-utils';
import { CloseButton, ContactCard } from './ContactCard';

jest.mock(`@cmctechnology/phoenix-stockbroking-web-design`, () => ({
  ...jest.requireActual(`@cmctechnology/phoenix-stockbroking-web-design`),
  useModalState: jest.fn()
}));

let tree: ReturnType<typeof renderer.create>;

describe(`ContactCard`, () => {
  const setModalState = jest.fn();
  beforeEach(() => (useModalState as jest.Mock).mockImplementation(() => [{} as IModalState, setModalState]));

  const ComponentToRender = () => (
    <ThemeProvider theme={themeCmcLight}>
      <ContactCard />
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should render without crashing`, () => {
      expect(() => renderer.create(<ComponentToRender />)).not.toThrow();
    });
  });

  it(`should call setModalState on close button click`, () => {
    act(() => {
      tree = renderer.create(<ComponentToRender />);
    });

    const closeButton = tree.root.findByType(CloseButton);
    expect(closeButton).not.toBeNull();

    act(() => {
      closeButton.props.onClick();
    });

    expect(setModalState.mock.calls.length).toBe(1);
    expect((setModalState.mock.calls[0][0] as IModalState).open).toBe(false);
  });
});
