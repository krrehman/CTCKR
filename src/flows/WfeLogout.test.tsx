import renderer from 'react-test-renderer';
import { waitFor } from '@testing-library/react';
import { CMCFRSDK, getNextStep } from '@cmctechnology/webinvest-store-client';
import WfeLogout from './WfeLogout';

jest.mock(`@cmctechnology/webinvest-store-client`, () => ({
  ...jest.requireActual(`@cmctechnology/webinvest-store-client`),
  getNextStep: jest.fn()
}));

describe(`WfeLogout`, () => {
  it(`should call logout on render`, async () => {
    (getNextStep as jest.Mock).mockImplementation(() => Promise.resolve(new CMCFRSDK.FRStep({})));
    const mockLogout = jest.fn();
    jest.spyOn(CMCFRSDK.FRUser, `logout`).mockImplementation(mockLogout);

    const mockWfeCallback = jest.fn();

    renderer.create(<WfeLogout wfeCallback={mockWfeCallback} />);

    await waitFor(() => {
      expect(mockWfeCallback).toHaveBeenCalledTimes(1);
    });

    mockWfeCallback.mock.calls[0][0]();

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });
});
