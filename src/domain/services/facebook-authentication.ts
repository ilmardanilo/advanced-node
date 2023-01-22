import { AuthenticationError } from '../entities/errors';
import { FacebookAuthentication } from '../../domain/features';
import { AccessToken, FacebookAccount } from '../entities';
import { LoadFacebookUserApi } from '../contracts/api';
import { TokenGenerator } from '../contracts/crypto';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '../contracts/repository';

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccount: LoadUserAccountRepository &
      SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator,
  ) {}
  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<FacebookAuthentication.Result> {
    const fbData = await this.facebookApi.loadUser(params);

    if (fbData) {
      const accountData = await this.userAccount.load({ email: fbData.email });
      const fbAccount = new FacebookAccount(fbData, accountData);
      const { id } = await this.userAccount.saveWithFacebook(fbAccount);
      const accessToken = await this.crypto.generateToken({
        key: id,
        expirationInMs: AccessToken.expirationInMs,
      });
      return { accessToken };
    }

    throw new AuthenticationError();
  }
}
