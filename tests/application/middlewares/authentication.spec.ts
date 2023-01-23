import {
  forbiddenError,
  HttpResponse,
  ok,
} from '../../../src/application/helpers';
import { ForbiddenError } from '../../../src/application/errors';
import { RequiredStringValidator } from '../../../src/application/validation';
import { Authorize } from '../../../src/domain/features';
import { mock, MockProxy } from 'jest-mock-extended';

type HttpRequest = { authorization: string };

type Model =
  | Error
  | {
      userId: string;
    };

export class AuthenticationMiddleware {
  constructor(private readonly authorize: Authorize) {}

  async handle({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    const error = new RequiredStringValidator(
      authorization,
      'authorization',
    ).validate();

    if (error) return forbiddenError();

    try {
      const userId = await this.authorize.perform({ token: authorization });
      return ok({ userId });
    } catch (error) {
      return forbiddenError();
    }
  }
}

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware;
  let authorize: MockProxy<Authorize>;
  let authorization: string;

  beforeAll(() => {
    authorization = 'any_authorization_token';
    authorize = mock();
    authorize.perform.mockResolvedValue('any_user_id');
  });

  beforeEach(() => {
    sut = new AuthenticationMiddleware(authorize);
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

    expect(authorize.perform).toHaveBeenCalledWith({ token: authorization });
    expect(authorize.perform).toHaveBeenCalledTimes(1);
  });

  it('should return 403 if authorize throws', async () => {
    authorize.perform.mockRejectedValueOnce(new Error('any_error'));

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
