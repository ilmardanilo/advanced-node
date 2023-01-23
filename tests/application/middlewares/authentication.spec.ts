import { forbiddenError, HttpResponse } from '../../../src/application/helpers';
import { ForbiddenError } from '../../../src/application/errors';

type HttpRequest = { authorization: string };

export class AuthenticationMiddleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse<Error>> {
    return forbiddenError();
  }
}

describe('AuthenticationMiddleware', () => {
  it('should return 403 if authorization is empty', async () => {
    const sut = new AuthenticationMiddleware();

    const httpResponse = await sut.handle({ authorization: '' });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });

  it('should return 403 if authorization is null', async () => {
    const sut = new AuthenticationMiddleware();

    const httpResponse = await sut.handle({ authorization: null as any });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });

  it('should return 403 if authorization is undefined', async () => {
    const sut = new AuthenticationMiddleware();

    const httpResponse = await sut.handle({ authorization: undefined as any });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });
});
