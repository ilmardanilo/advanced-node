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
    if (file) {
      const uuid = this.crypto.uuid({ key: id });
      pictureUrl = await this.fileStorage.upload({ file, key: uuid });
    }
    await this.userProfileRepo.savePicture({ pictureUrl });
    await this.userProfileRepo.load({ id });
  }
}
