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

  async load({ email }: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepo.findOne({ email });

    if (pgUser) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined,
      };
    }
  }

  async saveWithFacebook({
    id,
    email,
    name,
    facebookId,
  }: SaveParams): Promise<SaveResult> {
    let resultId: string;

    if (!id) {
      const pgUser = await this.pgUserRepo.save({ email, name, facebookId });
      resultId = pgUser.id.toString();
    } else {
      resultId = id;
      await this.pgUserRepo.update({ id: Number(id) }, { name, facebookId });
    }

    return { id: resultId };
  }
}
