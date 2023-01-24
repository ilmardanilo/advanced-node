import { forbiddenError, HttpResponse, ok } from '../helpers';
import { RequiredStringValidator } from '../validation';
import { Authorize } from '../../domain/features';

type HttpRequest = { authorization: string };

type Model =
  | Error
  | {
      userId: string;
    };

export class AuthenticationMiddleware {
  constructor(private readonly authorize: Authorize) {}

  async handle({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    if (!this.validate({ authorization })) return forbiddenError();

    try {
      const userId = await this.authorize.perform({ token: authorization });
      return ok({ userId });
    } catch (error) {
      return forbiddenError();
    }
  }

  private validate({ authorization }: HttpRequest): boolean {
    const error = new RequiredStringValidator(
      authorization,
      'authorization',
    ).validate();

    return error === undefined;
  }
}