import { ChangeProfilePictureService } from '../../../src/domain/services';
import {
  UploadFile,
  DeleteFile,
  UUIDGenerator,
} from '../../../src/domain/contracts/gateways';
import {
  SaveUserPictureRepository,
  LoadUserProfileRepository,
} from '../../../src/domain/contracts/repository';
import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';
import { UserProfile } from '../../../src/domain/entities';

jest.mock('../../../src/domain/entities/user-profile');

describe('ChangeProfilePictureService', () => {
  let uuid: string;
  let buffer: Buffer;
  let mimeType: string;
  let file: { buffer: Buffer; mimeType: string };
  let fileStorage: MockProxy<UploadFile & DeleteFile>;
  let crypto: MockProxy<UUIDGenerator>;
  let userProfileRepo: MockProxy<
    SaveUserPictureRepository & LoadUserProfileRepository
  >;
  let sut: ChangeProfilePictureService;

  beforeAll(() => {
    uuid = 'any_unique_id';
    buffer = Buffer.from('any_buffer');
    mimeType = 'image/png';
    file = { buffer, mimeType };
    fileStorage = mock();
    fileStorage.upload.mockResolvedValue('any_url');
    crypto = mock();
    crypto.uuid.mockReturnValue(uuid);
    userProfileRepo = mock();
    userProfileRepo.load.mockResolvedValue({ name: 'Alícia Barbosa Lima' });
  });

  beforeEach(() => {
    sut = new ChangeProfilePictureService(fileStorage, crypto, userProfileRepo);
  });

  it('should call UploadFile with correct params', async () => {
    await sut.perform({
      id: 'any_id',
      file: { buffer, mimeType: 'image/png' },
    });

    expect(fileStorage.upload).toHaveBeenCalledWith({
      file: buffer,
      fileName: `${uuid}.png`,
    });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });

  it('should call UploadFile with correct params', async () => {
    await sut.perform({
      id: 'any_id',
      file: { buffer, mimeType: 'image/jpeg' },
    });

    expect(fileStorage.upload).toHaveBeenCalledWith({
      file: buffer,
      fileName: `${uuid}.jpeg`,
    });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });

  it('should not call UploadFile when file is undefined', async () => {
    await sut.perform({ id: 'any_id', file: undefined });

    expect(fileStorage.upload).not.toHaveBeenCalled();
  });

  it('should call SaveUserPictureRepository with correct params', async () => {
    await sut.perform({ id: 'any_id', file });

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(
      mocked(UserProfile).mock.instances[0],
    );
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPictureRepository with correct params', async () => {
    userProfileRepo.load.mockResolvedValueOnce(undefined);
    await sut.perform({ id: 'any_id', file });

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(
      mocked(UserProfile).mock.instances[0],
    );
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call LoadUserProfileRepository with correct params', async () => {
    await sut.perform({ id: 'any_id', file: undefined });

    expect(userProfileRepo.load).toHaveBeenCalledWith({
      id: 'any_id',
    });
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1);
  });

  it('should not call LoadUserProfileRepository if file exists', async () => {
    await sut.perform({ id: 'any_id', file });

    expect(userProfileRepo.load).not.toHaveBeenCalled();
  });

  it('should return correct data on success', async () => {
    mocked(UserProfile).mockImplementationOnce((id) => ({
      setPicture: jest.fn(),
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: 'any_initials',
    }));

    const result = await sut.perform({ id: 'any_id', file });

    expect(result).toEqual({
      pictureUrl: 'any_url',
      initials: 'any_initials',
    });
  });

  it('should call DeleteFile when file exists and SaveUserPictureRepository throws', async () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error());
    expect.assertions(2);

    const promise = sut.perform({ id: 'any_id', file });

    promise.catch(() => {
      expect(fileStorage.delete).toHaveBeenCalledWith({ fileName: uuid });
      expect(fileStorage.delete).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call DeleteFile when file does not exists and SaveUserPictureRepository throws', async () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error());
    expect.assertions(1);

    const promise = sut.perform({ id: 'any_id', file: undefined });

    promise.catch(() => {
      expect(fileStorage.delete).not.toHaveBeenCalled();
    });
  });

  it('should rethrow if SaveUserPictureRepository throws', async () => {
    const error = new Error('save_error');
    userProfileRepo.savePicture.mockRejectedValueOnce(error);

    const promise = sut.perform({ id: 'any_id', file });

    await expect(promise).rejects.toThrow(error);
  });
});
