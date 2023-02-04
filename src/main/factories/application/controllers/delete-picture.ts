import { DeletePictureController } from '../../../../application/controllers';
import { makeChangeProfilePictureService } from '../../domain/services';

export const makeDeletePictureController = (): DeletePictureController => {
  return new DeletePictureController(makeChangeProfilePictureService());
};
