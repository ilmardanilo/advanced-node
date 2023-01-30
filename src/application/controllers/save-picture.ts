import { HttpResponse, ok } from '../helpers';
import { ChangeProfilePicture } from '../../domain/features';
import { Controller } from './controller';
import {
  AllowedMimeTypes,
  MaxFileSize,
  Required,
  Validator,
} from '../validation';

type HttpRequest = {
  file: { buffer: Buffer; mimeType: string };
  userId: string;
};
type Model = Error | { initials?: string; pictureUrl?: string };

export class SavePictureController extends Controller {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
    super();
  }

  async perform({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    const result = await this.changeProfilePicture.perform({
      file: file.buffer,
      id: userId,
    });

    return ok(result);
  }

  buildValidators({ file }: HttpRequest): Validator[] {
    return [
      new Required(file, 'file'),
      new Required(file.buffer, 'file'),
      new AllowedMimeTypes(['png', 'jpg'], file.mimeType),
      new MaxFileSize(5, file.buffer),
    ];
  }
}
