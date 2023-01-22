import { HttpResponse, ok, unauthorized } from '../helpers';
import { Controller } from './controller';
import { FacebookAuthentication } from '../../domain/features';
import { AccessToken } from '../../domain/entities';
import { ValidationBuilder, Validator } from '../validation';

type HttpRequest = {
  token: string;
};

type Model =
  | Error
  | {
      accessToken: string;
    };

export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {
    super();
  }

  async perform({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication.perform({ token });
    return accessToken instanceof AccessToken
      ? ok({ accessToken: accessToken.value })
      : unauthorized();
  }

  override buildValidators({ token }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({
        value: token,
        fieldName: 'token',
      })
        .required()
        .build(),
    ];
  }
}
