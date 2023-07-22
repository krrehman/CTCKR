import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { Text, themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { BuildErrorForm } from './BuildErrorForm';
import * as FormDetails from './FormDetails';
import { IErrorFormProps } from './Form';
import { ErrorMessageCode, JourneyTree, useFRConfig } from '@cmctechnology/webinvest-store-client';

describe(`BuildErrorForm`, () => {
  let tree: ReturnType<typeof renderer.create>;
  useFRConfig(JourneyTree.FR_JOURNEY_FORGOT_PASSWORD);

  const outcome = {
    code: ErrorMessageCode.CMCAccountInactive,
    customerRef: `some-ref`
  };

  const ComponentToRender = (props: IErrorFormProps) => (
    <ThemeProvider theme={themeCmcLight}>
      <BrowserRouter>
        <BuildErrorForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  it(`should match snapshot`, () => {
    tree = renderer.create(<ComponentToRender errorOutcome={outcome} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it(`should render with subtitle`, () => {
    const subtitleText = `some-subtitle`;

    jest.spyOn(FormDetails, `getErrorFormDetails`).mockReturnValue({ title: `some-title`, subtitle: subtitleText, content: <></> });

    tree = renderer.create(<ComponentToRender errorOutcome={outcome} />);

    const subtitle = tree.root.findAllByType(Text);
    expect(subtitle.length).toBe(1);
    expect(subtitle[0].props.children).toEqual(subtitleText);
  });
});
