import { getRepository } from 'typeorm';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '../../../data/contracts/repository';
import { PgUser } from '../entities';

type LoadParams = LoadUserAccountRepository.Params;
type LoadResult = LoadUserAccountRepository.Result;
type SaveParams = SaveFacebookAccountRepository.Params;

export class PgUserAccountRepository implements LoadUserAccountRepository {
  private readonly pgUserRepo = getRepository(PgUser);

  async load(params: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepo.findOne({ email: params.email });

    if (pgUser) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined,
      };
    }
  }

  async saveWithFacebook(params: SaveParams): Promise<void> {
    const { id, email, name, facebookId } = params;

    if (!id) {
      await this.pgUserRepo.save({
        email,
        name,
        facebookId,
      });
    } else {
      await this.pgUserRepo.update(
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
