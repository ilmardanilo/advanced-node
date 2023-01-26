import { UUIDGenerator } from '../contracts/crypto';
import { UploadFile } from '../contracts/gateways';

type Params = { id: string; file?: Buffer };

export class ChangeProfilePictureService {
  constructor(
    private readonly fileStorage: UploadFile,
    private readonly crypto: UUIDGenerator,
  ) {}

  async perform({ id, file }: Params): Promise<void> {
    if (file) {
      const uuid = this.crypto.uuid({ key: id });
      await this.fileStorage.upload({ file, key: uuid });
    }
  }
}
