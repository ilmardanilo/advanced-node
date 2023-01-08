import { AuthenticationError } from '../../domain/errors';
import { FacebookAuthentication } from '../../domain/features';
import { AccessToken, FacebookAccount } from '../../domain/models';
import { LoadFacebookUserApi } from '../contracts/api';
import { TokenGenerator } from '../contracts/crypto';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '../contracts/repository';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccount: LoadUserAccountRepository &
      SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator,
  ) {}
  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);

    if (fbData) {
      const accountData = await this.userAccount.load({ email: fbData.email });
      const fbAccount = new FacebookAccount(fbData, accountData);
      const { id } = await this.userAccount.saveWithFacebook(fbAccount);
      await this.crypto.generateToken({
        key: id,
        expirationInMs: AccessToken.expirationInMs,
      });
    }

    return new AuthenticationError();
  }
}
