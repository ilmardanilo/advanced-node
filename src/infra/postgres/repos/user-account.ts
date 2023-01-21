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
  async load({ email }: LoadParams): Promise<LoadResult> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne({ email });

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
    const pgUserRepo = getRepository(PgUser);
    let resultId: string;

    if (!id) {
      const pgUser = await pgUserRepo.save({ email, name, facebookId });
      resultId = pgUser.id.toString();
    } else {
      resultId = id;
      await pgUserRepo.update({ id: Number(id) }, { name, facebookId });
    }

    return { id: resultId };
  }
}
