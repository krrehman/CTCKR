import React from 'react';
import styled from 'styled-components';
import { CmcWebApi } from '@cmctechnology/webinvest-api-client-web-trading';
import { InterceptorManager } from '../Modules';
import { IUserDetails } from '../components/Journey/StepManager';
import { CMCFRSDK } from '@cmctechnology/webinvest-store-client';

export interface ILoginInterceptorProps extends IUserDetails {
  interceptors: CmcWebApi.Client.LogonInterceptorModel2[];
  refreshTokenCallback?: () => Promise<CMCFRSDK.Tokens>;
  onLogin?: () => void;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const LoginInterceptor: React.FC<ILoginInterceptorProps> = (props): JSX.Element => (
  <Wrapper>
    <InterceptorManager {...props} />
  </Wrapper>
);
