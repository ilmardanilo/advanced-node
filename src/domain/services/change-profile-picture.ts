import { UUIDGenerator } from '../contracts/crypto';
import { UploadFile } from '../contracts/gateways';
import {
  LoadUserProfileRepository,
  SaveUserPictureRepository,
} from '../contracts/repository';
import { UserProfile } from '../entities';

type Params = { id: string; file?: Buffer };
type Result = { pictureUrl?: string; initials?: string };

export class ChangeProfilePictureService {
  constructor(
    private readonly fileStorage: UploadFile,
    private readonly crypto: UUIDGenerator,
    private readonly userProfileRepo: SaveUserPictureRepository &
      LoadUserProfileRepository,
  ) {}

  async perform({ id, file }: Params): Promise<Result> {
    const data: { pictureUrl?: string; name?: string } = {};

    if (file) {
      const uuid = this.crypto.uuid({ key: id });
      data.pictureUrl = await this.fileStorage.upload({ file, key: uuid });
    } else {
      data.name = (await this.userProfileRepo.load({ id })).name;
    }

    const userProfile = new UserProfile(id);
    userProfile.setPicture(data);

    await this.userProfileRepo.savePicture(userProfile);

    return {
      pictureUrl: userProfile.pictureUrl,
      initials: userProfile.initials,
    };
  }
}
