import { ChangeProfilePicture } from '../../../src/domain/features';
import { mock, MockProxy } from 'jest-mock-extended';

type HttpRequest = { userId: string };

export class DeletePictureController {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {}

  async handle({ userId }: HttpRequest): Promise<void> {
    await this.changeProfilePicture.perform({ id: userId });
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

  it('should call ChangeProfilePicture with correct params', async () => {
    await sut.handle({ userId: 'any_user_id' });

    expect(ChangeProfilePicture.perform).toHaveBeenCalledWith({
      id: 'any_user_id',
    });
    expect(ChangeProfilePicture.perform).toHaveBeenCalledTimes(1);
  });
});
