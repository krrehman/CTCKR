import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clientActions } from '@cmctechnology/webinvest-store-client';
import { ApiRequestStatus, frontendActions } from '@cmctechnology/webinvest-store-frontend';
import { useModalState } from '@cmctechnology/phoenix-stockbroking-web-design';
import logout, { redirectToLogin } from './logout';
import { FormLoader, FormLoaderWrapper } from '../components/Forms/Form';
import { IStore } from '../store/Store';
import { CLIENT_DETAILS_API_RESULT_KEY } from '../constants/apiKeyConstants';

export interface ICheckCmcSessionResult {
  setRequestToCheckSession: Dispatch<SetStateAction<boolean>>;
}

const frSignOutAndRedirect = async () => {
  // FR signout.
  await logout.moduleConstructor();
  // redirect to login.
  redirectToLogin();
};

// non falcon only.
// checks CMC session by requesting ClientDetailsGet1.
// should force signout the user in case of fail.
// calls onSuccess handler ( which opens internal journey in modal) in case of success.
export const useCheckCmcSession = (onSuccess: () => void): ICheckCmcSessionResult => {
  const dispatch = useDispatch();
  const [requestToCheckSession, setRequestToCheckSession] = useState(false);
  const [, setModalState] = useModalState();
  const status = useSelector((store: IStore) => store.frontend.apiResults[CLIENT_DETAILS_API_RESULT_KEY]?.status);

  useEffect(() => {
    if (requestToCheckSession) {
      setModalState({
        dialog: (
          <FormLoaderWrapper>
            <FormLoader />
          </FormLoaderWrapper>
        ),
        open: true
      });
      dispatch<any>(clientActions.fetchClientDetails());
    }
  }, [requestToCheckSession]);

  useEffect(() => {
    if (requestToCheckSession) {
      // if ClientDetailsGet1 check is successfull, proceed further with starting FR flow.
      if (status === ApiRequestStatus.Success && requestToCheckSession) {
        dispatch<any>(frontendActions.apiRequestReset(CLIENT_DETAILS_API_RESULT_KEY));
        setRequestToCheckSession(false);
        onSuccess();
      }

      // if ClientDetailsGet1 check failed, force sign out.
      if (status === ApiRequestStatus.Failed) {
        dispatch<any>(frontendActions.apiRequestReset(CLIENT_DETAILS_API_RESULT_KEY));
        setRequestToCheckSession(false);
        setModalState({ open: false });
        // should signout.
        frSignOutAndRedirect();
      }
    }
  }, [status]);

  return { setRequestToCheckSession };
};
