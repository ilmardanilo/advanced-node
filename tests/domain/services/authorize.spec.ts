import { mock, MockProxy } from 'jest-mock-extended';

export interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => Promise<void>;
}

export namespace TokenValidator {
  export type Params = { token: string };
}

export class AuthorizeService implements Authorize {
  constructor(private readonly tokenValidator: TokenValidator) {}

  async perform({ token }: Authorize.Params): Promise<void> {
    await this.tokenValidator.validateToken({ token });
  }
}

export interface Authorize {
  perform: (params: Authorize.Params) => Promise<void>;
}

export namespace Authorize {
  export type Params = {
    token: string;
  };
}

describe('AuthorizeService', () => {
  let crypto: MockProxy<TokenValidator>;
  let sut: AuthorizeService;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    crypto = mock();
  });

  beforeEach(() => {
    sut = new AuthorizeService(crypto);
  });

  it('Should call TokenValidator with correct params', async () => {
    await sut.perform({ token });

    expect(crypto.validateToken).toHaveBeenCalledWith({ token });
    expect(crypto.validateToken).toHaveBeenCalledTimes(1);
  });
});
