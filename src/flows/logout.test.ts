import logout from './logout';

import { getNextStep, CMCFRSDK } from '@cmctechnology/webinvest-store-client';

jest.mock(`@cmctechnology/webinvest-store-client`, () => ({
  ...jest.requireActual(`@cmctechnology/webinvest-store-client`),
  getNextStep: jest.fn()
}));

describe(`logout`, () => {
  beforeEach(() => {
    (getNextStep as jest.Mock).mockImplementation(() => Promise.resolve(new CMCFRSDK.FRStep({})));
  });

  it(`should logout`, async () => {
    const mockLogout = jest.fn();
    jest.spyOn(CMCFRSDK.FRUser, `logout`).mockImplementation(mockLogout);
    logout.moduleConstructor();

    await new Promise(process.nextTick);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it(`should call console.error on getNextStep`, async () => {
    (getNextStep as jest.Mock).mockImplementation(() => {
      throw new Error(`logout-error`);
    });

    const mockLogout = jest.fn();
    const mockConsoleError = jest.fn();
    jest.spyOn(CMCFRSDK.FRUser, `logout`).mockImplementation(mockLogout);
    jest.spyOn(console, `error`).mockImplementation(mockConsoleError);
    logout.moduleConstructor();

    await new Promise(process.nextTick);
    expect(mockConsoleError).toHaveBeenCalledTimes(1);
  });

  it(`should call console.error on logout failure`, async () => {
    const mockLogout = jest.fn(() => {
      throw new Error(`logout-error`);
    });
    const mockConsoleError = jest.fn();
    jest.spyOn(CMCFRSDK.FRUser, `logout`).mockImplementation(mockLogout);
    jest.spyOn(console, `error`).mockImplementation(mockConsoleError);
    logout.moduleConstructor();

    await new Promise(process.nextTick);
    expect(mockConsoleError).toHaveBeenCalledTimes(1);
  });
});
