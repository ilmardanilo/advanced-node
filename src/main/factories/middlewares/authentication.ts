import { AuthenticationMiddleware } from '../../../application/middlewares';
import { AuthorizeService } from '../../../domain/services';
import { makeJwtTokenHandler } from '../crypto';

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const authorize = new AuthorizeService(makeJwtTokenHandler());
  return new AuthenticationMiddleware(authorize);
};
