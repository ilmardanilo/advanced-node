import { UUIDGenerator } from '../contracts/crypto';
import { UploadFile } from '../contracts/gateways';
import {
  LoadUserProfileRepository,
  SaveUserPictureRepository,
} from '../contracts/repository';

type Params = { id: string; file?: Buffer };

export class ChangeProfilePictureService {
  constructor(
    private readonly fileStorage: UploadFile,
    private readonly crypto: UUIDGenerator,
    private readonly userProfileRepo: SaveUserPictureRepository &
      LoadUserProfileRepository,
  ) {}

  async perform({ id, file }: Params): Promise<void> {
    let pictureUrl: string | undefined;
    let initials: string | undefined;
    if (file) {
      const uuid = this.crypto.uuid({ key: id });
      pictureUrl = await this.fileStorage.upload({ file, key: uuid });
    } else {
      const { name } = await this.userProfileRepo.load({ id });
      if (name) {
        const firstLetters = name.match(/\b(.)/g) ?? [];
        if (firstLetters.length > 1) {
          initials = `${firstLetters.shift()?.toUpperCase() ?? ''}${firstLetters.pop()?.toUpperCase() ?? ''}`;
        } else {
          initials = name.substring(0, 2)?.toUpperCase();
        }
      }
    }
    await this.userProfileRepo.savePicture({ pictureUrl, initials });
  }
}
