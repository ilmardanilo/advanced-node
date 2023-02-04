import { PgUser } from '../../../src/infra/postgres/entities';
import { makeFakeDb } from '../../infra/postgres/mocks';

import { IBackup } from 'pg-mem';
import { getConnection } from 'typeorm';
import request from 'supertest';

describe('User Routes', () => {
  describe('DELETE /users/picture', () => {
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

    it('should return 403 if no authorization header is present', async () => {
      const { app } = await import('../../../src/main/config/app');
      const { status } = await request(app).delete('/api/users/picture');

      expect(status).toBe(403);
    });
  });
});
