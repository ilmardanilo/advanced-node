import { Router } from 'express';
import { adaptExpressRoute } from '../adapters';
import { makeFacebookLoginController } from '../factories/application/controllers';

export const loginRouter = Router();

loginRouter.post(
  '/login/facebook',
  adaptExpressRoute(makeFacebookLoginController()),
);
