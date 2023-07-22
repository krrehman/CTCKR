import React, { useContext, useEffect } from 'react';
import { useModuleObject } from '@cmctechnology/webinvest-module';
import { PROMO_POD_MODULE_NAME } from '../../constants/constants';
import { IPodDescriptor } from '../../pods/podProps';
import { PodContext } from './PodContext';

export interface IPodItemProps {
  name: string;
}

export const PodItem: React.FC<IPodItemProps> = ({ name }): JSX.Element => {
  const { setPodDescriptor } = useContext(PodContext);
  const module = useModuleObject({ appName: PROMO_POD_MODULE_NAME, moduleName: `./${name}` });
  let Pod = module.moduleConstructor ?? (() => <></>);

  useEffect(() => {
    if (module.moduleConstructor && module.bgColors) {
      setPodDescriptor(module as IPodDescriptor);
    }
  }, [module]);

  return <Pod />;
};
