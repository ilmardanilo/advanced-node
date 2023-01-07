import { AuthenticationError } from '../../domain/errors';
import { FacebookAuthentication } from '../../domain/features';
import { LoadFacebookUserApi } from '../contracts/api';
import {
  LoadUserAccountRepository,
  CreateFacebookAccountRepository,
} from '../contracts/repository';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccount: LoadUserAccountRepository &
      CreateFacebookAccountRepository,
  ) {}
  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData) {
      await this.userAccount.load({ email: fbData.email });
      await this.userAccount.createFromFacebook(fbData);
    }

    return new AuthenticationError();
  }
}
