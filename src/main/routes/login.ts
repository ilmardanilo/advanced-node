import { Router } from 'express';
import { ExpressRouter } from '../../infra/http';
import { makeFacebookLoginController } from '../factories/controllers';

export const loginRouter = Router();

const adapter = new ExpressRouter(makeFacebookLoginController());

loginRouter.post('/login/facebook', adapter.adapt);
