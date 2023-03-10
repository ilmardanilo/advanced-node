import { PgUser } from '../../../src/infra/postgres/entities';
import { makeFakeDb } from '../../infra/postgres/mocks';
import { env } from '../../../src/main/config/env';

import { IBackup } from 'pg-mem';
import { getConnection, getRepository, Repository } from 'typeorm';
import request from 'supertest';
import { sign } from 'jsonwebtoken';

describe('User Routes', () => {
  let backup: IBackup;
  let pgUserRepo: Repository<PgUser>;

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser]);
    backup = db.backup();
    pgUserRepo = getRepository(PgUser);
  });

  afterAll(async () => {
    await getConnection().close();
  });

  beforeEach(() => {
    backup.restore();
  });

  describe('DELETE /users/picture', () => {
    it('should return 403 if no authorization header is present', async () => {
      const { app } = await import('../../../src/main/config/app');
      const { status } = await request(app).delete('/api/users/picture');

      expect(status).toBe(403);
    });

    it('should return 200 with valid data', async () => {
      const { id } = await pgUserRepo.save({
        email: 'any_email',
        name: 'Ilmar Danilo',
      });
      const authorization = sign({ key: id }, env.jwtSecret);

      const { app } = await import('../../../src/main/config/app');
      const { status, body } = await request(app)
        .delete('/api/users/picture')
        .set({ authorization });

      expect(status).toBe(200);
      expect(body).toEqual({ pictureUrl: undefined, initials: 'ID' });
    });
  });

  describe('PUT /users/picture', () => {
    const uploadSpy = jest.fn()

    jest.mock('../../../src/infra/gateways/aws-s3-file-storage', () => ({
      AwsS3FileStorage: jest.fn().mockReturnValue({ upload: uploadSpy })
    }))

    it('should return 403 if no authorization header is present', async () => {
      const { app } = await import('../../../src/main/config/app');
      const { status } = await request(app).put('/api/users/picture');

      expect(status).toBe(403);
    });

    it('should return 200 with valid data', async () => {
      uploadSpy.mockResolvedValueOnce('any_url')
      const { id } = await pgUserRepo.save({ email: 'any_email', name: 'Ilmar Danilo' });
      const authorization = sign({ key: id }, env.jwtSecret);

      const { app } = await import('../../../src/main/config/app');
      const { status, body } = await request(app)
        .put('/api/users/picture')
        .set({ authorization })
        .attach('picture', Buffer.from('any_buffer'), { filename: 'any_ name', contentType: 'image/png'});

      expect(status).toBe(200);
      expect(body).toEqual({ pictureUrl: 'any_url', initials: undefined });
    });
  });
});
