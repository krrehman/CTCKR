import React, { useEffect } from 'react';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';
import { IFormProps } from './Form';

export const ProfileCollectorForm: React.FC<IFormProps> = ({ step, applyActionCallback }): JSX.Element => {
  useEffect(() => {
    const device = new CMCFRSDK.FRDevice();

    const getDeviceProfile = async () => {
      const location = !!step.callbacks[0].getOutputValue(`location`);
      const metadata = !!step.callbacks[0].getOutputValue(`metadata`);
      const profile = await device.getProfile({ location, metadata });
      step.setCallbackValue(CMCFRSDK.CallbackType.DeviceProfileCallback, JSON.stringify(profile));
      applyActionCallback();
    };

    getDeviceProfile();
  }, [step]);

  return <></>;
};
