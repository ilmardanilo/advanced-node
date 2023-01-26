import { mock } from 'jest-mock-extended';

type Params = { id: string; file: Buffer };

export class ChangeProfilePictureService {
  constructor(private readonly fileStorage: UploadFile) {}

  async perform({ id, file }: Params): Promise<void> {
    await this.fileStorage.upload({ file, key: id });
  }
}

export interface UploadFile {
  upload(params: UploadFile.Params): Promise<void>;
}

export namespace UploadFile {
  export type Params = { file: Buffer; key: string };
}

describe('ChangeProfilePictureService', () => {
  it('should call UploadFile with correct params', async () => {
    const file = Buffer.from('any_buffer');
    const fileStorage = mock<UploadFile>();
    const sut = new ChangeProfilePictureService(fileStorage);

    await sut.perform({ id: 'any_id', file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_id' });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });
});
