import { adaptExpressRoute, adaptMulter } from '../adapters';
import { auth } from '../middlewares';
import { makeSavePictureController } from '../factories/application/controllers';
import { Router } from 'express';

export const userRouter = Router();

userRouter.delete('/users/picture', auth, adaptExpressRoute(makeSavePictureController()));
userRouter.put('/users/picture', auth, adaptMulter, adaptExpressRoute(makeSavePictureController()));
