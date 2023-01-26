import { mock, MockProxy } from 'jest-mock-extended';

type Params = { id: string; file: Buffer };

export class ChangeProfilePictureService {
  constructor(
    private readonly fileStorage: UploadFile,
    private readonly crypto: UUIDGenerator,
  ) {}

  async perform({ id, file }: Params): Promise<void> {
    const uuid = this.crypto.uuid({ key: id });
    await this.fileStorage.upload({ file, key: uuid });
  }
}

export interface UploadFile {
  upload(params: UploadFile.Params): Promise<void>;
}

export namespace UploadFile {
  export type Params = { file: Buffer; key: string };
}

export interface UUIDGenerator {
  uuid(params: UUIDGenerator.Params): UUIDGenerator.Result;
}

export namespace UUIDGenerator {
  export type Params = { key: string };
  export type Result = string;
}

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
