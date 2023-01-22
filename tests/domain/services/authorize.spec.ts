import { AuthorizeService } from '../../../src/domain/services';
import { TokenValidator } from '../../../src/domain/contracts/crypto';

import { mock, MockProxy } from 'jest-mock-extended';

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
