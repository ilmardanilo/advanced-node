import { UUIDHandler } from '../../../src/infra/gateways';

import { v4 } from 'uuid';
import { mocked } from 'ts-jest/utils';

jest.mock('uuid');

describe('UUIDHandler', () => {
  let sut: UUIDHandler;
  let key: string;

  beforeAll(() => {
    key = 'any_key';
    mocked(v4).mockReturnValue('any_uuid');
  });

  beforeEach(() => {
    sut = new UUIDHandler();
  });

  it('should call uuid.v4', () => {
    sut.uuid({ key });

    expect(v4).toHaveBeenCalledTimes(1);
  });

  it('should return correct uuid', () => {
    const uuid = sut.uuid({ key });

    expect(uuid).toBe('any_key_any_uuid');
  });
});
