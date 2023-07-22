import renderer from 'react-test-renderer';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom';
import { themeCmcLight } from '@cmctechnology/phoenix-stockbroking-web-design';
import { ThemeProvider } from 'styled-components';
import { ProfileCollectorForm } from './ProfileCollectorForm';
import { IFormProps } from './Form';

const step: CMCFRSDK.Step = {
  callbacks: [
    {
      input: [{ name: `IDToken1`, value: `` }],
      output: [
        { name: `location`, value: true },
        { name: `metadata`, value: true }
      ],
      type: CMCFRSDK.CallbackType.DeviceProfileCallback
    }
  ]
};

describe(`ProfileCollectorForm`, () => {
  let frStep: CMCFRSDK.FRStep;
  let mockGetProfile: jest.Mock;

  beforeEach(() => {
    mockGetProfile = jest.fn(() => Promise.resolve({} as any));
    jest.spyOn(CMCFRSDK.FRDevice.prototype, `getProfile`).mockImplementation(mockGetProfile);
    frStep = new CMCFRSDK.FRStep(step);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const ComponentToRender = (props: IFormProps) => (
    <ThemeProvider theme={themeCmcLight}>
      <BrowserRouter>
        <ProfileCollectorForm {...props} />
      </BrowserRouter>
    </ThemeProvider>
  );

  describe(`render`, () => {
    it(`should match snapshot`, async () => {
      expect(renderer.create(<ComponentToRender step={frStep} applyActionCallback={jest.fn()} />).toJSON()).toMatchSnapshot();

      await waitFor(() => {
        expect(mockGetProfile).toHaveBeenCalledTimes(1);
      });
    });
  });

  it(`should call getProfile & applyActionCallback`, async () => {
    const mockGetProfileData = jest.fn(() => Promise.resolve({} as any));
    jest.spyOn(CMCFRSDK.FRDevice.prototype, `getProfile`).mockImplementation(mockGetProfileData);

    const applyActionCallbackMock = jest.fn();

    expect(mockGetProfileData).not.toHaveBeenCalled();

    act(() => {
      renderer.create(<ComponentToRender step={frStep} applyActionCallback={applyActionCallbackMock} />);
    });

    await waitFor(() => {
      expect(mockGetProfileData).toHaveBeenCalledTimes(1);
      expect(mockGetProfileData).toHaveBeenCalledWith({ location: true, metadata: true });
      expect(applyActionCallbackMock).toHaveBeenCalledTimes(1);
    });
  });
});
