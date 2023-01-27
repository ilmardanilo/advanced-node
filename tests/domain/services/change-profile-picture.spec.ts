import { ChangeProfilePictureService } from '../../../src/domain/services';
import { UUIDGenerator } from '../../../src/domain/contracts/crypto';
import { UploadFile } from '../../../src/domain/contracts/gateways';
import {
  SaveUserPictureRepository,
  LoadUserProfileRepository,
} from '../../../src/domain/contracts/repository';
import { mock, MockProxy } from 'jest-mock-extended';

describe('ChangeProfilePictureService', () => {
  let uuid: string;
  let file: Buffer;
  let fileStorage: MockProxy<UploadFile>;
  let crypto: MockProxy<UUIDGenerator>;
  let userProfileRepo: MockProxy<
    SaveUserPictureRepository & LoadUserProfileRepository
  >;
  let sut: ChangeProfilePictureService;

  beforeAll(() => {
    uuid = 'any_unique_id';
    file = Buffer.from('any_buffer');
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
    await sut.perform({ id: 'any_id', file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });

  it('should not call UploadFile when file is undefined', async () => {
    await sut.perform({ id: 'any_id', file: undefined });

    expect(fileStorage.upload).not.toHaveBeenCalled();
  });

  it('should call SaveUserPictureRepository with correct params', async () => {
    await sut.perform({ id: 'any_id', file });

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: 'any_url',
      initials: undefined,
    });
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPictureRepository with correct params when file is undefined', async () => {
    await sut.perform({ id: 'any_id', file: undefined });

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: undefined,
      initials: 'AL',
    });
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPictureRepository with correct params when file is undefined', async () => {
    userProfileRepo.load.mockResolvedValue({ name: 'alícia Barbosa lima' });

    await sut.perform({ id: 'any_id', file: undefined });

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: undefined,
      initials: 'AL',
    });
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPictureRepository with correct params when file is undefined', async () => {
    userProfileRepo.load.mockResolvedValue({ name: 'Ilmar' });

    await sut.perform({ id: 'any_id', file: undefined });

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: undefined,
      initials: 'IL',
    });
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPictureRepository with correct params when file is undefined', async () => {
    userProfileRepo.load.mockResolvedValue({ name: 'm' });

    await sut.perform({ id: 'any_id', file: undefined });

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: undefined,
      initials: 'M',
    });
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPictureRepository with correct params when file is undefined', async () => {
    userProfileRepo.load.mockResolvedValue({ name: undefined });

    await sut.perform({ id: 'any_id', file: undefined });

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: undefined,
      initials: undefined,
    });
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
});
