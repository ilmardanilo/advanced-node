import { Router } from 'express';
import { adaptExpressRoute } from '../../infra/http';
import { makeFacebookLoginController } from '../factories/controllers';

export const loginRouter = Router();

loginRouter.post(
  '/login/facebook',
  adaptExpressRoute(makeFacebookLoginController()),
);
