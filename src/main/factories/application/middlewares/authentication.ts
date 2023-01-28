import { AuthenticationMiddleware } from '../../../../application/middlewares';
import { makeJwtTokenHandler } from '../../infra/gateways';

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwt = makeJwtTokenHandler();
  return new AuthenticationMiddleware(jwt.validateToken.bind(jwt));
};
