import { FacebookLoginController } from '../../../src/application/controllers';
import { FacebookAuthentication } from '../../../src/domain/features';
import { AccessToken } from '../../../src/domain/models';
import { AuthenticationError } from '../../../src/domain/errors';
import { UnauthorizedError } from '../../../src/application/errors';
import { RequiredStringValidator } from '../../../src/application/validation';
import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;
  let facebookAuth: MockProxy<FacebookAuthentication>;
  let token: string;

  beforeAll(() => {
    facebookAuth = mock();
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'));
    token = 'any_token';
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth);
  });

  it('should build Validators correctly', async () => {
    const validators = sut.buildValidators({ token });

    expect(validators).toEqual([
      new RequiredStringValidator('any_token', 'token'),
    ]);
  });

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token });

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });

  it('should return 401 if authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError());
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    });
  });

  it('should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value',
      },
    });
  });
});
