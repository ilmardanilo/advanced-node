import { mock, MockProxy } from 'jest-mock-extended';

export interface TokenValidator {
  validateToken: (
    params: TokenValidator.Params,
  ) => Promise<TokenValidator.Result>;
}

export namespace TokenValidator {
  export type Params = { token: string };
  export type Result = string;
}

export class AuthorizeService implements Authorize {
  constructor(private readonly tokenValidator: TokenValidator) {}

  async perform({ token }: Authorize.Params): Promise<Authorize.Result> {
    return await this.tokenValidator.validateToken({ token });
  }
}

export interface Authorize {
  perform: (params: Authorize.Params) => Promise<Authorize.Result>;
}

export namespace Authorize {
  export type Params = {
    token: string;
  };
  export type Result = string;
}

describe('AuthorizeService', () => {
  let crypto: MockProxy<TokenValidator>;
  let sut: AuthorizeService;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    crypto = mock();
    crypto.validateToken.mockResolvedValue('any_value');
  });

  beforeEach(() => {
    sut = new AuthorizeService(crypto);
  });

  it('Should call TokenValidator with correct params', async () => {
    await sut.perform({ token });

    expect(crypto.validateToken).toHaveBeenCalledWith({ token });
    expect(crypto.validateToken).toHaveBeenCalledTimes(1);
  });

  it('Should return the correct accessToken', async () => {
    const userId = await sut.perform({ token });

    expect(userId).toBe('any_value');
  });
});
