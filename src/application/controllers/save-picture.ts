import { HttpResponse, ok } from '../helpers';
import { ChangeProfilePicture } from '../../domain/features';
import { Controller } from './controller';
import { ValidationBuilder, Validator } from '../validation';

type HttpRequest = {
  file?: { buffer: Buffer; mimeType: string };
  userId: string;
};
type Model = { initials?: string; pictureUrl?: string };

export class SavePictureController extends Controller {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
    super();
  }

  async perform({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    const { initials, pictureUrl } = await this.changeProfilePicture.perform({
      file,
      id: userId,
    });

    return ok({ initials, pictureUrl });
  }

  buildValidators({ file }: HttpRequest): Validator[] {
    if (file === undefined) return [];
    return [
      ...ValidationBuilder.of({ value: file, fieldName: 'file' })
        .required()
        .image({ allowed: ['png', 'jpg'], maxSizeInMb: 5 })
        .build(),
    ];
  }
}
