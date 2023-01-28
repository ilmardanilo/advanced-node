import { AuthenticationMiddleware } from '../../../src/application/middlewares';
import { ForbiddenError } from '../../../src/application/errors';
import { JwtTokenHandler } from '../../../src/infra/gateways';
import { mock, MockProxy } from 'jest-mock-extended';

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware;
  let authorize: MockProxy<JwtTokenHandler>;
  let authorization: string;

  beforeAll(() => {
    authorization = 'any_authorization_token';
    authorize = mock();
    authorize.validateToken.mockResolvedValue('any_user_id');
  });

  beforeEach(() => {
    sut = new AuthenticationMiddleware(authorize.validateToken);
  });

  it('should return 403 if authorization is empty', async () => {
    const httpResponse = await sut.handle({ authorization: '' });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });

  it('should return 403 if authorization is null', async () => {
    const httpResponse = await sut.handle({ authorization: null as any });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });

  it('should return 403 if authorization is undefined', async () => {
    const httpResponse = await sut.handle({ authorization: undefined as any });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });

  it('should call authorize with correct params', async () => {
    await sut.handle({ authorization });

    expect(authorize.validateToken).toHaveBeenCalledWith({
      token: authorization,
    });
    expect(authorize.validateToken).toHaveBeenCalledTimes(1);
  });

  it('should return 403 if authorize throws', async () => {
    authorize.validateToken.mockRejectedValueOnce(new Error('any_error'));

    const httpResponse = await sut.handle({ authorization });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });

  it('should return 200 with userId on success', async () => {
    const httpResponse = await sut.handle({ authorization });

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { userId: 'any_user_id' },
    });
  });
});
