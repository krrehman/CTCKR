import { clientActions, ApiRequest } from '@cmctechnology/webinvest-store-client';

export const FORGOT_PASSWORD_API_RESULT_KEY = clientActions.usersApiActionKey(ApiRequest.ForgotPassword);
export const FORGOT_PASSWORD_SUBMIT_API_RESULT_KEY = clientActions.usersApiActionKey(ApiRequest.ForgotPasswordSubmit);
export const SIGNIN_API_RESULT_KEY = clientActions.usersApiActionKey(ApiRequest.SignIn);
export const CLIENT_DETAILS_API_RESULT_KEY = clientActions.usersApiActionKey(ApiRequest.ClientDetailsGet1);
