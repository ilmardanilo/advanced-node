import { ChangeProfilePicture } from '../../../src/domain/features';
import { mock } from 'jest-mock-extended';

type HttpRequest = { userId: string };

export class DeletePictureController {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {}

  async handle({ userId }: HttpRequest): Promise<void> {
    await this.changeProfilePicture.perform({ id: userId });
  }
}

describe('DeletePictureController', () => {
  it('should call ChangeProfilePicture with correct params', async () => {
    const ChangeProfilePicture = mock<ChangeProfilePicture>();
    const sut = new DeletePictureController(ChangeProfilePicture);

    await sut.handle({ userId: 'any_user_id' });

    expect(ChangeProfilePicture.perform).toHaveBeenCalledWith({
      id: 'any_user_id',
    });
    expect(ChangeProfilePicture.perform).toHaveBeenCalledTimes(1);
  });
});
