import { Router } from 'express';
import { adaptExpressRoute } from '../adapters';
import { makeFacebookLoginController } from '../factories/controllers';

export const loginRouter = Router();

loginRouter.post(
  '/login/facebook',
  adaptExpressRoute(makeFacebookLoginController()),
);
