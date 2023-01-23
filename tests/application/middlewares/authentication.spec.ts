import { forbiddenError, HttpResponse } from '../../../src/application/helpers';
import { ForbiddenError } from '../../../src/application/errors';
import { RequiredStringValidator } from '../../../src/application/validation';
import { Authorize } from '../../../src/domain/features';
import { mock, MockProxy } from 'jest-mock-extended';

type HttpRequest = { authorization: string };

export class AuthenticationMiddleware {
  constructor(private readonly authorize: Authorize) {}

  async handle({
    authorization,
  }: HttpRequest): Promise<HttpResponse<Error> | undefined> {
    const error = new RequiredStringValidator(
      authorization,
      'authorization',
    ).validate();

    if (error) return forbiddenError();

    await this.authorize.perform({ token: authorization });
  }
}

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware;
  let authorize: MockProxy<Authorize>;
  let authorization: string;

  beforeAll(() => {
    authorization = 'any_authorization_token';
    authorize = mock();
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
});
