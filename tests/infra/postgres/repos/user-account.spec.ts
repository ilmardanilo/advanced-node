import { PgUser } from '../../../../src/infra/postgres/entities';
import { PgUserAccountRepository } from '../../../../src/infra/postgres/repos';
import { getRepository, Repository, getConnection } from 'typeorm';
import { makeFakeDb } from '../mocks';

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository;
  let pgUserRepo: Repository<PgUser>;

  beforeAll(async () => {
    await makeFakeDb([PgUser]);
    pgUserRepo = getRepository(PgUser);
  });

  afterAll(async () => {
    await getConnection().close();
  });

  beforeEach(() => {
    sut = new PgUserAccountRepository();
    pgUserRepo.delete({});
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
});
