import {
  Controller,
  SavePictureController,
} from '../../../src/application/controllers';
import { ChangeProfilePicture } from '../../../src/domain/features';
import { mock, MockProxy } from 'jest-mock-extended';
import {
  AllowedMimeTypes,
  MaxFileSize,
  Required,
} from '../../../src/application/validation';

describe('SavePictureController', () => {
  let buffer: Buffer;
  let mimeType: string;
  let file: { buffer: Buffer; mimeType: string };
  let userId: string;
  let changeProfilePicture: MockProxy<ChangeProfilePicture>;
  let sut: SavePictureController;

  beforeAll(() => {
    buffer = Buffer.from('any_buffer');
    mimeType = 'image/png';
    file = { buffer, mimeType };
    userId = 'any_user_id';
    changeProfilePicture = mock();
    changeProfilePicture.perform.mockResolvedValue({
      initials: 'any_initials',
      pictureUrl: 'any_url',
    });
  });

  beforeEach(() => {
    sut = new SavePictureController(changeProfilePicture);
  });

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller);
  });

  it('should build Validators correctly', async () => {
    const validators = sut.buildValidators({ file, userId });

    expect(validators).toEqual([
      new Required(file, 'file'),
      new Required(buffer, 'file'),
      new AllowedMimeTypes(['png', 'jpg'], mimeType),
      new MaxFileSize(5, buffer),
    ]);
  });

  it('should call ChangeProfilePicture with correct params', async () => {
    await sut.handle({ file, userId });

    expect(changeProfilePicture.perform).toHaveBeenCalledWith({
      id: userId,
      file,
    });
    expect(changeProfilePicture.perform).toHaveBeenCalledTimes(1);
  });

  it('should return 200 with valid data', async () => {
    const httpResponse = await sut.handle({ file, userId });

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { initials: 'any_initials', pictureUrl: 'any_url' },
    });
  });
});
