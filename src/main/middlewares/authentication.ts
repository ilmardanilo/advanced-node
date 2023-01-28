import { adaptExpressMiddleware } from '../adapters';
import { makeAuthenticationMiddleware } from '../factories/application/middlewares';

export const auth = adaptExpressMiddleware(makeAuthenticationMiddleware());
