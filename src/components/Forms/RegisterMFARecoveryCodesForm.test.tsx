import renderer, { act } from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IFormProps } from './Form';
import { RegisterMFARecoveryCodesForm } from './RegisterMFARecoveryCodesForm';

const callbacks = [
  {
    output: [
      {
        name: `message`,
        value: `/*\n * Copyright 2018 ForgeRock AS. All Rights Reserved\n *\n * Use of this code requires a commercial software license with ForgeRock AS.\n * or with one of its affiliates. All use shall be exclusively subject\n * to such license between the licensee and ForgeRock AS.\n */\n\nvar newLocation = document.getElementById(\"wrapper\");\nvar oldHtml = newLocation.getElementsByTagName(\"fieldset\")[0].innerHTML;\nnewLocation.getElementsByTagName(\"fieldset\")[0].innerHTML = \"<div class=\\\"panel panel-default\\\">\\n\" +\n    \"    <div class=\\\"panel-body text-center\\\">\\n\" +\n    \"        <h3>Your Recovery Codes</h3>\\n\" +\n    \"        <h4>You must make a copy of these recovery codes. They cannot be displayed again.</h4>\\n\" +\n    \"    </div>\\n\" +\n    \"<div class=\\\"text-center\\\">\\n\" +\n    \"uJdzNTuPfW\\n\" +\n    \"</div>\\n\" +\n    \"<div class=\\\"text-center\\\">\\n\" +\n    \"y06gJ21Qj9\\n\" +\n    \"</div>\\n\" +\n    \"<div class=\\\"text-center\\\">\\n\" +\n    \"RF2rLPqxNp\\n\" +\n    \"</div>\\n\" +\n    \"<div class=\\\"text-center\\\">\\n\" +\n    \"r8bBpdXdMd\\n\" +\n    \"</div>\\n\" +\n    \"<div class=\\\"text-center\\\">\\n\" +\n    \"eh1QszPvPD\\n\" +\n    \"</div>\\n\" +\n    \"<div class=\\\"text-center\\\">\\n\" +\n    \"wIuHMbgJFY\\n\" +\n    \"</div>\\n\" +\n    \"<div class=\\\"text-center\\\">\\n\" +\n    \"dbaWXaezSJ\\n\" +\n    \"</div>\\n\" +\n    \"<div class=\\\"text-center\\\">\\n\" +\n    \"VWmBMdd7wY\\n\" +\n    \"</div>\\n\" +\n    \"<div class=\\\"text-center\\\">\\n\" +\n    \"deUMWRNaqL\\n\" +\n    \"</div>\\n\" +\n    \"<div class=\\\"text-center\\\">\\n\" +\n    \"Vx3h354i3u\\n\" +\n    \"</div>\\n\" +\n    \"<div class=\\\"panel-body text-center\\\">\\n\" +\n    \"        <p>Use one of these codes to authenticate if you lose your device, which has been named: <em>Push Device</em></p>\\n\" +\n    \"</div>\\n\" +\n    \"</div>\" + oldHtml;\ndocument.body.appendChild(newLocation);\n\n\n`
      },
      { name: `messageType`, value: 4 }
    ],
    type: CMCFRSDK.CallbackType.TextOutputCallback
  }
];

const step: CMCFRSDK.Step = {
  callbacks
};

describe(`RegisterMFARecoveryCodesForm`, () => {
  let tree: ReturnType<typeof renderer.create>;
  let frStep: CMCFRSDK.FRStep;
  let applyActionCallbackMock: jest.Mock;

  beforeEach(() => {
    frStep = new CMCFRSDK.FRStep(step);
    applyActionCallbackMock = jest.fn();
  });

  const ComponentToRender = (props: IFormProps) => (
    <ThemeProvider theme={themeCmcLight}>
      <BrowserRouter>
        <RegisterMFARecoveryCodesForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();
    });
  });

  it(`should call applyActionCallback`, () => {
    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const doneButton = tree.root.findByProps({ 'data-testid': `RegisterMFARecoveryCodesForm.done` });
    expect(doneButton).toBeTruthy();

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(0);

    act(() => {
      doneButton.props.onClick();
    });

    expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
  });

  it(`should copyCodes`, () => {
    // The cdes are from callback output of html satring.
    // In the actual component they are parsed by sdk and are available by FRRecoveryCodes.getCodes(step).
    const codes = `uJdzNTuPfW,y06gJ21Qj9,RF2rLPqxNp,r8bBpdXdMd,eh1QszPvPD,wIuHMbgJFY,dbaWXaezSJ,VWmBMdd7wY,deUMWRNaqL,Vx3h354i3u`;
    const mockWriteText = jest.fn(() => Promise.resolve(`mocked`));

    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText
      }
    });

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const copyButton = tree.root.findByProps({ 'data-testid': `RegisterMFARecoveryCodesForm.copy` });
    expect(copyButton).toBeTruthy();

    expect(mockWriteText).toHaveBeenCalledTimes(0);

    act(() => {
      copyButton.props.onClick();
    });

    expect(mockWriteText).toHaveBeenCalledTimes(1);
    expect(mockWriteText).toHaveBeenCalledWith(codes);
  });

  it(`should printCodes`, () => {
    const mockPrint = jest.fn();

    Object.assign(window, {
      print: mockPrint
    });

    act(() => {
      tree = renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    const printButton = tree.root.findByProps({ 'data-testid': `RegisterMFARecoveryCodesForm.print` });
    expect(printButton).toBeTruthy();

    expect(mockPrint).toHaveBeenCalledTimes(0);

    act(() => {
      printButton.props.onClick();
    });

    expect(mockPrint).toHaveBeenCalledTimes(1);
  });
});
