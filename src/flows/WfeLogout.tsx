import React, { useEffect } from 'react';
import logout from './logout';

interface IWfeLogoutProps {
  wfeCallback: (frLogout: () => Promise<void>) => void;
}

const WfeLogout: React.FC<IWfeLogoutProps> = ({ wfeCallback }) => {
  useEffect(() => {
    wfeCallback(logout.moduleConstructor);
  }, []);

  return <></>;
};

export default WfeLogout;
