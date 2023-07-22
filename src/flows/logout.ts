import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { OPEN_SELF_URL_TARGET, frontendActions, getConfig } from '@cmctechnology/webinvest-store-frontend';
import { JourneyTree, getNextStep, useFRConfig } from '@cmctechnology/webinvest-store-client';

export const redirectToLogin = () => {
  // hardcoded for SG for now (should be based on location/theme).
  frontendActions.redirectToUrl(`${getConfig().hostUrl}/sg/login`, OPEN_SELF_URL_TARGET);
};

const logout = async () => {
  useFRConfig(JourneyTree.FR_JOURNEY_LOGOUT);

  try {
    await getNextStep(undefined, JourneyTree.FR_JOURNEY_LOGOUT);
  } catch (error) {
    console.error(error);
  }

  try {
    await CMCFRSDK.FRUser.logout();
  } catch (error) {
    console.error(error);
  }
};

export default { moduleConstructor: logout };
