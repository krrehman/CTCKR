import React, { PropsWithChildren } from 'react';
import { IPage } from '../models/page';
import { PageHead } from '../components/PageHead';
import { ILoginInterceptorProps } from './LoginInterceptor';

export interface IPageProps {
  onNext: () => void;
  onInterceptorsRequired?: (props: ILoginInterceptorProps) => void;
  onCloseModal?: () => void;
}

export const PageBase: React.FC<PropsWithChildren<IPage>> = (props) => {
  const { children } = props;
  return (
    <>
      <PageHead page={props} />
      {children}
    </>
  );
};
