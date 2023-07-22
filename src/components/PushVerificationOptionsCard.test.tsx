import renderer from 'react-test-renderer';
import { themeCmcLight, useModalState, IModalState } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { act } from 'react-dom/test-utils';
import { IPushVerificationOptionsCardProps, PushVerificationOptionsCard } from './PushVerificationOptionsCard';

jest.mock(`@cmctechnology/phoenix-stockbroking-web-design`, () => ({
  ...jest.requireActual(`@cmctechnology/phoenix-stockbroking-web-design`),
  useModalState: jest.fn()
}));

let tree: ReturnType<typeof renderer.create>;

describe(`PushVerificationOptionsCard`, () => {
  let setModalState: jest.Mock;
  beforeEach(() => {
    setModalState = jest.fn();
    (useModalState as jest.Mock).mockImplementation(() => [{} as IModalState, setModalState]);
  });

  const ComponentToRender = (props: IPushVerificationOptionsCardProps) => (
    <ThemeProvider theme={themeCmcLight}>
      <PushVerificationOptionsCard {...props} />
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should render without crashing`, () => {
      expect(() => renderer.create(<ComponentToRender backupCodesSelectionHandler={jest.fn()} />)).not.toThrow();
    });
  });

  it(`should call backupCodesSelectionHandler`, () => {
    const mockBackupCodesSelectionHandler = jest.fn();

    act(() => {
      tree = renderer.create(<ComponentToRender backupCodesSelectionHandler={mockBackupCodesSelectionHandler} />);
    });

    const codesButton = tree.root.findByProps({ 'data-testid': `PushVerificationOptionsCard.codes` });

    expect(setModalState).not.toHaveBeenCalled();
    expect(mockBackupCodesSelectionHandler).not.toHaveBeenCalled();

    act(() => {
      codesButton.props.onClick();
    });

    expect(mockBackupCodesSelectionHandler).toHaveBeenCalledTimes(1);
    expect(setModalState).toHaveBeenCalledTimes(1);
  });

  // the case when the card opens in modal for internal journeys.
  it(`should call backupCodesSelectionHandler, but not setModalState`, () => {
    const mockBackupCodesSelectionHandler = jest.fn();

    act(() => {
      tree = renderer.create(<ComponentToRender backupCodesSelectionHandler={mockBackupCodesSelectionHandler} isInModal />);
    });

    const codesButton = tree.root.findByProps({ 'data-testid': `PushVerificationOptionsCard.codes` });

    expect(mockBackupCodesSelectionHandler).not.toHaveBeenCalled();
    expect(setModalState).not.toHaveBeenCalled();

    act(() => {
      codesButton.props.onClick();
    });

    expect(mockBackupCodesSelectionHandler).toHaveBeenCalledTimes(1);
    expect(setModalState).not.toHaveBeenCalled();
  });

  it(`should call setModalState on close button click`, () => {
    act(() => {
      tree = renderer.create(<ComponentToRender backupCodesSelectionHandler={jest.fn()} />);
    });

    expect(setModalState).not.toHaveBeenCalled();

    const closeButton = tree.root.findByProps({ 'data-testid': `PushVerificationOptionsCard.close` });

    act(() => {
      closeButton.props.onClick();
    });

    expect(setModalState).toHaveBeenCalledTimes(1);
    expect(setModalState).toHaveBeenCalledWith({ open: false });
  });

  it(`should call goBackHandler on close button click`, () => {
    const mockGoBackHandler = jest.fn();

    act(() => {
      tree = renderer.create(<ComponentToRender backupCodesSelectionHandler={jest.fn()} isInModal goBackHandler={mockGoBackHandler} />);
    });

    expect(setModalState).not.toHaveBeenCalled();

    const closeButton = tree.root.findByProps({ 'data-testid': `PushVerificationOptionsCard.close` });

    act(() => {
      closeButton.props.onClick();
    });

    expect(setModalState).not.toHaveBeenCalled();
    expect(mockGoBackHandler).toHaveBeenCalledTimes(1);
  });
});
