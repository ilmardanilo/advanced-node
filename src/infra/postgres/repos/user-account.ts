import { getRepository } from 'typeorm';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '../../../data/contracts/repository';
import { PgUser } from '../entities';

type LoadParams = LoadUserAccountRepository.Params;
type LoadResult = LoadUserAccountRepository.Result;
type SaveParams = SaveFacebookAccountRepository.Params;
type SaveResult = SaveFacebookAccountRepository.Result;

export class PgUserAccountRepository
  implements LoadUserAccountRepository, SaveFacebookAccountRepository
{
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

  async saveWithFacebook(params: SaveParams): Promise<SaveResult> {
    let id: string;

    if (!params.id) {
      const pgUser = await this.pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId,
      });
      id = pgUser.id.toString();
    } else {
      id = params.id;
      await this.pgUserRepo.update(
        {
          id: Number(params.id),
        },
        {
          name: params.name,
          facebookId: params.facebookId,
        },
      );
    }

    return { id };
  }
}