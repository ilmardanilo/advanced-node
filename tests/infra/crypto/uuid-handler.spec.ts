import { UUIDGenerator } from '../../../src/domain/contracts/crypto';
import { v4 } from 'uuid';

jest.mock('uuid');

export class UUIDHandler {
  uuid({ key }: UUIDGenerator.Params): void {
    v4();
  }
}

describe('UUIDHandler', () => {
  it('should call uuid.v4', () => {
    const sut = new UUIDHandler();

    sut.uuid({ key: 'any_key' });

    expect(v4).toHaveBeenCalledTimes(1);
  });
});
