import renderer from 'react-test-renderer';
import { JourneyHandlerActionType, JourneyTree } from '@cmctechnology/webinvest-store-client';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { PageShell } from './PageShell';
import { initialPodContext } from './Pod/PodContext';
import { Provider } from 'react-redux';
import { Store } from '../store/Store';
import { JourneyManager } from './Journey/JourneyManager';

describe(`PageShell`, () => {
  const ComponentToRender = () => (
    <Provider store={Store}>
      <ThemeProvider theme={themeCmcLight}>
        <PageShell>
          <JourneyManager
            onNext={jest.fn()}
            onInterceptorsRequired={jest.fn()}
            action={{ type: JourneyHandlerActionType.Login, tree: JourneyTree.FR_JOURNEY_LOGIN }}
          />
        </PageShell>
      </ThemeProvider>
    </Provider>
  );

  describe(`render`, () => {
    it(`should render without crashing`, () => {
      expect(() => renderer.create(<ComponentToRender />)).not.toThrow();
    });

    it(`should create PodContext`, () => {
      const InitialPod = initialPodContext.podDescriptor.moduleConstructor(`some-id`);
      const InitialDisclaimer = (initialPodContext.podDescriptor.disclaimerConstructor as Function)(`some_url`, `#ffffff`);
      // calling this just to satisfy test coverage.
      initialPodContext.setPodDescriptor(initialPodContext.podDescriptor);

      expect(InitialPod).toEqual(<>no module!</>);
      expect(InitialDisclaimer).toEqual(<>no disclaimer!</>);
    });
  });
});
