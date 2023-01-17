import { Router } from 'express';

export const loginRouter = Router();

loginRouter.post('/login/facebook', (req, res) => {
  res.send({ data: 'any_data' });
});
