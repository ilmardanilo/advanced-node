import { UUIDGenerator } from '../contracts/crypto';
import { DeleteFile, UploadFile } from '../contracts/gateways';
import {
  LoadUserProfileRepository,
  SaveUserPictureRepository,
} from '../contracts/repository';
import { UserProfile } from '../entities';

type Params = { id: string; file?: Buffer };
type Result = { pictureUrl?: string; initials?: string };

export class ChangeProfilePictureService {
  constructor(
    private readonly fileStorage: UploadFile & DeleteFile,
    private readonly crypto: UUIDGenerator,
    private readonly userProfileRepo: SaveUserPictureRepository &
      LoadUserProfileRepository,
  ) {}

  async perform({ id, file }: Params): Promise<Result> {
    const key = this.crypto.uuid({ key: id });
    const data: { pictureUrl?: string; name?: string } = {};

    if (file) {
      data.pictureUrl = await this.fileStorage.upload({ file, key });
    } else {
      data.name = (await this.userProfileRepo.load({ id })).name;
    }

    const userProfile = new UserProfile(id);
    userProfile.setPicture(data);

    try {
      await this.userProfileRepo.savePicture(userProfile);
    } catch {
      if (file) {
        await this.fileStorage.delete({ key });
      }
      throw new Error();
    }

    return {
      pictureUrl: userProfile.pictureUrl,
      initials: userProfile.initials,
    };
  }
}
