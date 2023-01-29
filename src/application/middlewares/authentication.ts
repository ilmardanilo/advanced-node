import { forbiddenError, HttpResponse, ok } from '../helpers';
import { RequiredString } from '../validation';
// import { Authorize } from '../../domain/features';
import { Middleware } from './middleware';

type HttpRequest = { authorization: string };

type Model =
  | Error
  | {
      userId: string;
    };

type Authorize = (params: { token: string }) => Promise<string>;

export class AuthenticationMiddleware implements Middleware {
  constructor(private readonly authorize: Authorize) {}

  async handle({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    if (!this.validate({ authorization })) return forbiddenError();

    try {
      const userId = await this.authorize({ token: authorization });
      return ok({ userId });
    } catch (error) {
      return forbiddenError();
    }
  }

  private validate({ authorization }: HttpRequest): boolean {
    const error = new RequiredString(authorization, 'authorization').validate();

    return error === undefined;
  }
}
