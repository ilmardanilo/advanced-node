import { app } from '../../../src/main/config/app';
import { auth } from '../../../src/main/middlewares';
import { ForbiddenError } from '../../../src/application/errors';

import request from 'supertest';

describe('Authentication Middleware', () => {
  it('should return 403 if authorization header was not provided', async () => {
    app.get('/fake-route', auth);

    const { status, body } = await request(app).get('/fake-route');

    expect(status).toBe(403);
    expect(body.error).toBe(new ForbiddenError().message);
  });
});
