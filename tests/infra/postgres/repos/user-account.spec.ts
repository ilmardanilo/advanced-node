import { PgUser } from '../../../../src/infra/postgres/entities';
import { PgUserAccountRepository } from '../../../../src/infra/postgres/repos';
import { getRepository, Repository, getConnection } from 'typeorm';
import { makeFakeDb } from '../mocks';
import { IBackup } from 'pg-mem';

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository;
  let pgUserRepo: Repository<PgUser>;
  let backup: IBackup;

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser]);
    backup = db.backup();
    pgUserRepo = getRepository(PgUser);
  });

  afterAll(async () => {
    await getConnection().close();
  });

  beforeEach(() => {
    sut = new PgUserAccountRepository();
    backup.restore();
  });

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'any_email' });

      const account = await sut.load({ email: 'any_email' });

      expect(account).toEqual({ id: '1' });
    });

    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'any_email' });

      expect(account).toBeUndefined();
    });
  });

  describe('saveWithFacebook', () => {
    it('should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id',
      });
      const pgUser = await pgUserRepo.findOne({ email: 'any_email' });

      expect(pgUser?.id).toBe(1);
      expect(id).toBe('1');
    });

    it('should update an account if id is defined', async () => {
      await pgUserRepo.save({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id',
      });
      const { id } = await sut.saveWithFacebook({
        id: '1',
        email: 'new_email',
        name: 'new_name',
        facebookId: 'new_fb_id',
      });
      const pgUser = await pgUserRepo.findOne({ id: 1 });

      expect(pgUser).toMatchObject({
        id: 1,
        email: 'any_email',
        name: 'new_name',
        facebookId: 'new_fb_id',
      });
      expect(id).toBe('1');
    });
  });
});
