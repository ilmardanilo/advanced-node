import { UUIDGenerator } from '../../domain/contracts/gateways';

import { v4 } from 'uuid';

export class UUIDHandler implements UUIDGenerator {
  uuid({ key }: UUIDGenerator.Params): UUIDGenerator.Result {
    return `${key}_${v4()}`;
  }
}
