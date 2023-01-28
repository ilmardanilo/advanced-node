import { SaveUserPictureRepository } from '../../../domain/contracts/repository';
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
}
