import { createMemoryHistory } from 'history';
import { act } from 'react-dom/test-utils';
import { useSearchParams, useNavigate, Router } from 'react-router-dom';
import { CMCFRSDK, Page, getOAuth } from '@cmctechnology/webinvest-store-client';
import renderer from 'react-test-renderer';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { HelmetProvider } from 'react-helmet-async';
import { FRRoutes, reacquireTokens } from './FRRoutes';
import { pages } from './constants/pageConstants';
import { Provider } from 'react-redux';
import { Store } from './store/Store';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ForgotUsername } from './pages/ForgotUsername';

jest.mock(`@cmctechnology/webinvest-store-client`, () => ({
  ...jest.requireActual(`@cmctechnology/webinvest-store-client`),
  getOAuth: jest.fn()
}));

jest.mock(`react-router-dom`, () => ({
  ...jest.requireActual(`react-router-dom`),
  useSearchParams: jest.fn(),
  useNavigate: jest.fn()
}));

jest.mock(`react-redux`, () => ({
  ...jest.requireActual(`react-redux`),
  useDispatch: jest.fn()
}));

interface IComponentToRenderProps {
  path: string;
}

describe(`FRRoutes`, () => {
  let mockNavigate: jest.Mock;
  const redirectUrl = `some-redirect-url`;

  const ComponentToRender = ({ path }: IComponentToRenderProps) => {
    const history = createMemoryHistory();
    history.push(`/${path}`);

    return (
      <Provider store={Store}>
        <ThemeProvider theme={themeCmcLight}>
          <HelmetProvider>
            <Router location={history.location} navigator={history}>
              <FRRoutes />
            </Router>
          </HelmetProvider>
        </ThemeProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useSearchParams as jest.Mock).mockReturnValue([{ get: () => redirectUrl }]);
  });

  describe(`render`, () => {
    it(`should render Page.LogIn without crashing`, () => {
      expect(() => renderer.create(<ComponentToRender path={pages[Page.LogIn].path} />)).not.toThrow();
    });
  });

  describe(`login`, () => {
    it(`should call navigate, when onNext is executed (redirect url not provided)`, () => {
      (useSearchParams as jest.Mock).mockReturnValue([{ get: () => `` }]);

      const tree = renderer.create(<ComponentToRender path={pages[Page.LogIn].path} />);
      const page = tree.root.findByType(Login);

      act(() => {
        page.props.onNext();
      });

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: `/` });
    });

    it(`should call navigate, when onNext is executed (redirect url provided)`, () => {
      const tree = renderer.create(<ComponentToRender path={pages[Page.LogIn].path} />);
      const page = tree.root.findByType(Login);

      act(() => {
        page.props.onNext();
      });

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: redirectUrl });
    });

    it(`should call redirectHandler when interceptors required (redirect url defined)`, () => {
      const tree = renderer.create(<ComponentToRender path={pages[Page.LogIn].path} />);
      const page = tree.root.findByType(Login);

      act(() => {
        page.props.onInterceptorsRequired();
      });

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: pages[Page.LoginInterceptors].path, search: `?redirect_url=${redirectUrl}` });
    });

    it(`should call redirectHandler when interceptors required (redirect url undefined)`, () => {
      (useSearchParams as jest.Mock).mockReturnValue([{ get: () => undefined }]);

      const tree = renderer.create(<ComponentToRender path={pages[Page.LogIn].path} />);
      const page = tree.root.findByType(Login);

      act(() => {
        page.props.onInterceptorsRequired();
      });

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: pages[Page.LoginInterceptors].path, search: `` });
    });
  });

  describe(`forgot-password`, () => {
    it(`should call navigate, when onNext is executed (redirect url not provided)`, () => {
      (useSearchParams as jest.Mock).mockReturnValue([{ get: () => `` }]);

      const tree = renderer.create(<ComponentToRender path={pages[Page.ForgotPassword].path} />);
      const page = tree.root.findByType(ForgotPassword);

      act(() => {
        page.props.onNext();
      });

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: `/` });
    });

    it(`should call navigate, when onNext is executed (redirect url provided)`, () => {
      const tree = renderer.create(<ComponentToRender path={pages[Page.ForgotPassword].path} />);
      const page = tree.root.findByType(ForgotPassword);

      act(() => {
        page.props.onNext();
      });

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: redirectUrl });
    });

    it(`should call redirectHandler when interceptors required (redirect url defined)`, () => {
      const tree = renderer.create(<ComponentToRender path={pages[Page.ForgotPassword].path} />);
      const page = tree.root.findByType(ForgotPassword);

      act(() => {
        page.props.onInterceptorsRequired();
      });

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: pages[Page.LoginInterceptors].path, search: `?redirect_url=${redirectUrl}` });
    });

    it(`should call redirectHandler when interceptors required (redirect url undefined)`, () => {
      (useSearchParams as jest.Mock).mockReturnValue([{ get: () => undefined }]);

      const tree = renderer.create(<ComponentToRender path={pages[Page.ForgotPassword].path} />);
      const page = tree.root.findByType(ForgotPassword);

      act(() => {
        page.props.onInterceptorsRequired();
      });

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: pages[Page.LoginInterceptors].path, search: `` });
    });
  });

  describe(`forgot-username`, () => {
    it(`should call navigate, when onNext is executed (redirect url not provided)`, () => {
      (useSearchParams as jest.Mock).mockReturnValue([{ get: () => `` }]);

      const tree = renderer.create(<ComponentToRender path={pages[Page.ForgotUsername].path} />);
      const page = tree.root.findByType(ForgotUsername);

      act(() => {
        page.props.onNext();
      });

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: `/` });
    });

    it(`should call navigate, when onNext is executed (redirect url provided)`, () => {
      const tree = renderer.create(<ComponentToRender path={pages[Page.ForgotUsername].path} />);
      const page = tree.root.findByType(ForgotUsername);

      act(() => {
        page.props.onNext();
      });

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: redirectUrl });
    });

    it(`should call redirectHandler when interceptors required (redirect url defined)`, () => {
      const tree = renderer.create(<ComponentToRender path={pages[Page.ForgotUsername].path} />);
      const page = tree.root.findByType(ForgotUsername);

      act(() => {
        page.props.onInterceptorsRequired();
      });

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: pages[Page.LoginInterceptors].path, search: `?redirect_url=${redirectUrl}` });
    });

    it(`should call redirectHandler when interceptors required (redirect url undefined)`, () => {
      (useSearchParams as jest.Mock).mockReturnValue([{ get: () => undefined }]);

      const tree = renderer.create(<ComponentToRender path={pages[Page.ForgotUsername].path} />);
      const page = tree.root.findByType(ForgotUsername);

      act(() => {
        page.props.onInterceptorsRequired();
      });

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: pages[Page.LoginInterceptors].path, search: `` });
    });
  });

  describe(`reacquireTokens`, () => {
    it(`should return tokens`, async () => {
      const tokenObject = {
        accessToken: `some-access-token`
      };

      (getOAuth as jest.Mock).mockImplementation(() => Promise.resolve({ success: true }));
      jest.spyOn(CMCFRSDK.TokenStorage, `get`).mockImplementation(() => Promise.resolve(tokenObject));

      const tokens = await reacquireTokens();
      expect(tokens).toEqual(tokenObject);
    });
  });
});
