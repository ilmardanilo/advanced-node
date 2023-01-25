import { app } from '../../../src/main/config/app';
import { auth } from '../../../src/main/middlewares';
import { env } from '../../../src/main/config/env';
import { ForbiddenError } from '../../../src/application/errors';

import request from 'supertest';
import { sign } from 'jsonwebtoken';

describe('Authentication Middleware', () => {
  it('should return 403 if authorization header was not provided', async () => {
    app.get('/fake-route', auth);

    const { status, body } = await request(app).get('/fake-route');

    expect(status).toBe(403);
    expect(body.error).toBe(new ForbiddenError().message);
  });

  it('should return 200 if authorization header is valid', async () => {
    const authorization = sign({ key: 'any_user_id' }, env.jwtSecret);
    app.get('/fake-route', auth, (req, res) => {
      res.json(req.locals);
    });

    const { status, body } = await request(app)
      .get('/fake-route')
      .set({ authorization });

    expect(status).toBe(200);
    expect(body).toEqual({ userId: 'any_user_id' });
  });
});
