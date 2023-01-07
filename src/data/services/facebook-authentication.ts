import { AuthenticationError } from '../../domain/errors';
import { FacebookAuthentication } from '../../domain/features';
import { LoadFacebookUserApi } from '../contracts/api';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '../contracts/repository';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccount: LoadUserAccountRepository &
      SaveFacebookAccountRepository,
  ) {}
  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);

    if (fbData) {
      const accountData = await this.userAccount.load({ email: fbData.email });

      await this.userAccount.saveWithFacebook({
        id: accountData?.id,
        name: accountData?.name ?? fbData.name,
        email: fbData.email,
        facebookId: fbData.facebookId,
      });
    }

    return new AuthenticationError();
  }
}
