import { ChangeProfilePictureService } from '../../../src/domain/services';
import { UUIDGenerator } from '../../../src/domain/contracts/crypto';
import { UploadFile } from '../../../src/domain/contracts/gateways';
import { mock, MockProxy } from 'jest-mock-extended';

describe('ChangeProfilePictureService', () => {
  let uuid: string;
  let file: Buffer;
  let fileStorage: MockProxy<UploadFile>;
  let crypto: MockProxy<UUIDGenerator>;
  let sut: ChangeProfilePictureService;

  beforeAll(() => {
    uuid = 'any_unique_id';
    file = Buffer.from('any_buffer');
    fileStorage = mock();
    crypto = mock();
    crypto.uuid.mockReturnValue(uuid);
  });

  beforeEach(() => {
    sut = new ChangeProfilePictureService(fileStorage, crypto);
  });

  it('should call UploadFile with correct params', async () => {
    await sut.perform({ id: 'any_id', file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });
});
