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

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication,
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
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
