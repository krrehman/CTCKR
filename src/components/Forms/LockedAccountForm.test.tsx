import renderer from 'react-test-renderer';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { IErrorFormProps } from './Form';
import { LockedAccountForm } from './LockedAccountForm';
import { ErrorMessageCode, JourneyTree, Page, useFRConfig } from '@cmctechnology/webinvest-store-client';
import { pages } from '../../constants/pageConstants';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe(`LockedAccountForm`, () => {
  let tree: ReturnType<typeof renderer.create>;
  let mockNavigate: jest.Mock;
  const errorOutcome = {
    code: ErrorMessageCode.CMCAccountLocked,
    customerRef: `some-ref`
  };

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
  });

  const ComponentToRender = (props: IErrorFormProps) => (
    <ThemeProvider theme={themeCmcLight}>
      <BrowserRouter>
        <LockedAccountForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      useFRConfig(JourneyTree.FR_JOURNEY_LOGIN);
      expect(renderer.create(<ComponentToRender errorOutcome={errorOutcome} />).toJSON()).toMatchSnapshot();
    });
  });

  it(`should navigate to login on backToLoginButton click`, () => {
    useFRConfig(JourneyTree.FR_JOURNEY_FORGOT_PASSWORD);
    tree = renderer.create(<ComponentToRender errorOutcome={errorOutcome} />);

    const backToLoginButton = tree.root.findByProps({ 'data-testid': `LockedAccountForm.backToLogin` });
    expect(backToLoginButton).toBeTruthy();

    backToLoginButton.props.onClick();

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(`../${pages[Page.LogIn].path}`);
  });

  it(`should reload on backToLoginButton click, when on login journey/route`, () => {
    useFRConfig(JourneyTree.FR_JOURNEY_LOGIN);

    tree = renderer.create(<ComponentToRender errorOutcome={errorOutcome} />);

    const backToLoginButton = tree.root.findByProps({ 'data-testid': `LockedAccountForm.backToLogin` });
    expect(backToLoginButton).toBeTruthy();

    backToLoginButton.props.onClick();

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(0);
  });
});
