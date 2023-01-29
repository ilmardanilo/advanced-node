import { Controller } from './controller';
import { HttpResponse, noContent } from '../helpers';
import { ChangeProfilePicture } from '../../domain/features';

type HttpRequest = { userId: string };

export class DeletePictureController extends Controller {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
    super();
  }

  async perform({ userId }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture.perform({ id: userId });

    return noContent();
  }
}
