import { AuthenticationError } from '../../domain/errors';
import { FacebookAuthentication } from '../../domain/features';
import { LoadFacebookUserApi } from '../contracts/api';
import {
  LoadUserAccountRepository,
  CreateFacebookAccountRepository,
  UpdateFacebookAccountRepository,
} from '../contracts/repository';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccount: LoadUserAccountRepository &
      CreateFacebookAccountRepository &
      UpdateFacebookAccountRepository,
  ) {}
  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData) {
      const accountData = await this.userAccount.load({ email: fbData.email });
      if (accountData?.name) {
        await this.userAccount.updateWithFacebook({
          id: accountData.id,
          name: accountData.name,
          facebookId: fbData.facebookId,
        });
      } else {
        await this.userAccount.createFromFacebook(fbData);
      }
    }

    return new AuthenticationError();
  }
}
