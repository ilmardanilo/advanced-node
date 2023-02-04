import { DeleteFile, UploadFile, UUIDGenerator } from '../contracts/gateways';
import {
  LoadUserProfileRepository,
  SaveUserPictureRepository,
} from '../contracts/repository';
import { UserProfile } from '../entities';
import { ChangeProfilePicture } from '../features';

export class ChangeProfilePictureService implements ChangeProfilePicture {
  constructor(
    private readonly fileStorage: UploadFile & DeleteFile,
    private readonly crypto: UUIDGenerator,
    private readonly userProfileRepo: SaveUserPictureRepository &
      LoadUserProfileRepository,
  ) {}

  async perform({
    id,
    file,
  }: ChangeProfilePicture.Params): Promise<ChangeProfilePicture.Result> {
    const key = this.crypto.uuid({ key: id });
    const data: { pictureUrl?: string; name?: string } = {};

    if (file) {
      const mimeType = file.mimeType.split('/')[1];
      data.pictureUrl = await this.fileStorage.upload({
        file: file.buffer,
        fileName: `${key}.${mimeType}`,
      });
    } else {
      data.name = (await this.userProfileRepo.load({ id }))?.name;
    }

    const userProfile = new UserProfile(id);
    userProfile.setPicture(data);

    try {
      await this.userProfileRepo.savePicture(userProfile);
    } catch (error) {
      if (file) await this.fileStorage.delete({ fileName: key });
      throw error;
    }

    return {
      pictureUrl: userProfile.pictureUrl,
      initials: userProfile.initials,
    };
  }
}
