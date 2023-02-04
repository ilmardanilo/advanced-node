import { Router } from 'express';
import { auth } from '../middlewares';

export const userRouter = Router();

userRouter.delete('/users/picture', auth);
