import { mock } from 'jest-mock-extended';

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
  it('should call UploadFile with correct params', async () => {
    const uuid = 'any_unique_id';
    const file = Buffer.from('any_buffer');
    const fileStorage = mock<UploadFile>();
    const crypto = mock<UUIDGenerator>();
    crypto.uuid.mockReturnValue(uuid);
    const sut = new ChangeProfilePictureService(fileStorage, crypto);

    await sut.perform({ id: 'any_id', file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });
});
