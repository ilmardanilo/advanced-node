import { getRepository } from 'typeorm';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '../../../data/contracts/repository';
import { PgUser } from '../entities';

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

  async saveWithFacebook(
    params: SaveFacebookAccountRepository.Params,
  ): Promise<void> {
    const { id, email, name, facebookId } = params;
    const pgUserRepo = getRepository(PgUser);

    if (!id) {
      await pgUserRepo.save({
        email,
        name,
        facebookId,
      });
    } else {
      await pgUserRepo.update(
        {
          id: Number(id),
        },
        {
          name,
          facebookId,
        },
      );
    }
  }
}
