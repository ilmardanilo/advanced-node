import { ChangeProfilePictureService } from '../../../../domain/services';
import { makeAwsS3FileStorage, makeUUIDHandler } from '../../infra/gateways';
import { makePgUserProfileRepository } from '../../infra/repositories';

export const makeChangeProfilePictureService =
  (): ChangeProfilePictureService => {
    return new ChangeProfilePictureService(
      makeAwsS3FileStorage(),
      makeUUIDHandler(),
      makePgUserProfileRepository(),
    );
  };
