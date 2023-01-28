import { FacebookApi } from '../../../../infra/gateways';
import { env } from '../../../config/env';
import { makeAxiosHttpClient } from './axios-client';

export const makeFacebookApi = (): FacebookApi => {
  return new FacebookApi(
    makeAxiosHttpClient(),
    env.facebookApi.clientId,
    env.facebookApi.clientSecret,
  );
};
