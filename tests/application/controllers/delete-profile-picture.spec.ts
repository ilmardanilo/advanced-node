import { Controller } from '../../../src/application/controllers';
import { HttpResponse, noContent } from '../../../src/application/helpers';
import { ChangeProfilePicture } from '../../../src/domain/features';
import { mock, MockProxy } from 'jest-mock-extended';

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

describe('DeletePictureController', () => {
  let ChangeProfilePicture: MockProxy<ChangeProfilePicture>;
  let sut: DeletePictureController;

  beforeAll(() => {
    ChangeProfilePicture = mock();
  });

  beforeEach(() => {
    sut = new DeletePictureController(ChangeProfilePicture);
  });

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller);
  });

  it('should call ChangeProfilePicture with correct params', async () => {
    await sut.handle({ userId: 'any_user_id' });

    expect(ChangeProfilePicture.perform).toHaveBeenCalledWith({
      id: 'any_user_id',
    });
    expect(ChangeProfilePicture.perform).toHaveBeenCalledTimes(1);
  });

  it('should return 204', async () => {
    const httpResponse = await sut.handle({ userId: 'any_user_id' });

    expect(httpResponse).toEqual({
      statusCode: 204,
      data: null,
    });
  });
});
