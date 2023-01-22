import { TokenValidator } from '../contracts/crypto';
import { Authorize } from '../features';

export class AuthorizeService implements Authorize {
  constructor(private readonly tokenValidator: TokenValidator) {}

  async perform({ token }: Authorize.Params): Promise<Authorize.Result> {
    return await this.tokenValidator.validateToken({ token });
  }
}
