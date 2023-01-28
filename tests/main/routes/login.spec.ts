import { PgUser } from '../../../src/infra/postgres/entities';
import { makeFakeDb } from '../../infra/postgres/mocks';
import { FacebookApi } from '../../../src/infra/gateways';
import { UnauthorizedError } from '../../../src/application/errors';

import { IBackup } from 'pg-mem';
import { getConnection } from 'typeorm';
import { mocked } from 'ts-jest/utils';
import request from 'supertest';

jest.mock('../../../src/infra/gateways/facebook-api');

describe('Login Routes', () => {
  describe('POST /login/facebook', () => {
    let backup: IBackup;

    beforeAll(async () => {
      const db = await makeFakeDb([PgUser]);
      backup = db.backup();
    });

    afterAll(async () => {
      await getConnection().close();
    });

    beforeEach(() => {
      backup.restore();
    });

    it('should return 200 with AccessToken', async () => {
      const FacebookApiStub = jest.fn().mockImplementation(() => ({
        loadUser: jest.fn().mockResolvedValueOnce({
          facebookId: 'any_id',
          name: 'any_name',
          email: 'any_email',
        }),
      }));
      mocked(FacebookApi).mockImplementation(FacebookApiStub);

      const { app } = await import('../../../src/main/config/app');
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })
        .expect(200);

      expect(status).toBe(200);
      expect(body.accessToken).toBeDefined();
    });

    it('should return 401 with UnauthorizedError', async () => {
      const FacebookApiStub = jest.fn().mockImplementation(() => ({
        loadUser: jest.fn().mockResolvedValueOnce(undefined),
      }));
      mocked(FacebookApi).mockImplementation(FacebookApiStub);

      const { app } = await import('../../../src/main/config/app');
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' });

      expect(status).toBe(401);
      expect(body.error).toBe(new UnauthorizedError().message);
    });
  });
});
