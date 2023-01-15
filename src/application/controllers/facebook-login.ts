import {
  badRequest,
  HttpResponse,
  ok,
  serverError,
  unauthorized,
} from '../helpers';
import { FacebookAuthentication } from '../../domain/features';
import { AccessToken } from '../../domain/models';
import { RequiredFieldError } from '../errors';

type HttpRequest = {
  token: string | null | undefined;
};

type Model =
  | Error
  | {
      accessToken: string;
    };

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      if (!httpRequest.token) {
        return badRequest(new RequiredFieldError('token'));
      }

      const accessToken = await this.facebookAuthentication.perform({
        token: httpRequest.token,
      });
      if (accessToken instanceof AccessToken) {
        return ok({ accessToken: accessToken.value });
      } else {
        return unauthorized();
      }
    } catch (error: any) {
      return serverError(error);
    }
  }
}
