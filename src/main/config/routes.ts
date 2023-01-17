import { Express } from 'express';
import { loginRouter } from '../routes/login';

export const setupRoutes = (app: Express): void => {
  app.use('/api', loginRouter);
};
