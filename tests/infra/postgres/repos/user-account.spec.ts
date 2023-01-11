import { PgUser } from '../../../../src/infra/postgres/entities';
import { PgUserAccountRepository } from '../../../../src/infra/postgres/repos';
import { IMemoryDb, newDb } from 'pg-mem';
import { getRepository, Repository, getConnection } from 'typeorm';

const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb();
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts'],
  });
  await connection.synchronize();
  return db;
};

describe('PgUserAccountRepository', () => {
  describe('load', () => {
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
