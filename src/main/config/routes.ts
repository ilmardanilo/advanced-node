import { Express } from 'express';
import { loginRouter, userRouter } from '../routes';

export const setupRoutes = (app: Express): void => {
  app.use('/api', loginRouter);
  app.use('/api', userRouter);
};
