import { LoadUserAccountRepository } from '../../../../src/data/contracts/repository';
import { IBackup, newDb } from 'pg-mem';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  getRepository,
  Repository,
  getConnection,
} from 'typeorm';

@Entity({ name: 'usuarios' })
class PgUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nome', nullable: true })
  name?: string;

  @Column()
  email!: string;

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: string;
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository;
    let pgUserRepo: Repository<PgUser>;

    beforeAll(async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser],
      });
      await connection.synchronize();
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

export class PgUserAccountRepository implements LoadUserAccountRepository {
  async load(
    params: LoadUserAccountRepository.Params,
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne({ email: params.email });

    if (pgUser) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined,
      };
    }
  }
}
