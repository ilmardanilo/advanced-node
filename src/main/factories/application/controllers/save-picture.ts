import { SavePictureController } from '../../../../application/controllers';
import { makeChangeProfilePictureService } from '../../domain/services';

export const makeSavePictureController = (): SavePictureController => {
  return new SavePictureController(makeChangeProfilePictureService());
};
