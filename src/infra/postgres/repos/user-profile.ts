import {
  LoadUserProfileRepository,
  SaveUserPictureRepository,
} from '../../../domain/contracts/repository';
import { PgUser } from '../entities';
import { getRepository } from 'typeorm';

export class PgUserProfileRepository implements SaveUserPictureRepository {
  async savePicture({
    id,
    pictureUrl,
    initials,
  }: SaveUserPictureRepository.Params): Promise<void> {
    const pgUserRepo = getRepository(PgUser);

    await pgUserRepo.update({ id: parseInt(id) }, { pictureUrl, initials });
  }

  async load({
    id,
  }: LoadUserProfileRepository.Params): Promise<LoadUserProfileRepository.Result> {
    const pgUserRepo = getRepository(PgUser);

    const pgUser = await pgUserRepo.findOne({ id: parseInt(id) });

    if (pgUser) return { name: pgUser.name ?? undefined };
  }
}
