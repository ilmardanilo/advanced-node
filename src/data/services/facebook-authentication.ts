import { AuthenticationError } from '../../domain/errors';
import { FacebookAuthentication } from '../../domain/features';
import { LoadFacebookUserApi } from '../contracts/api';
import { LoadUserAccountRepository } from '../contracts/repository';

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
  ) {}
  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser(params);
    if (fbData) {
      await this.loadUserAccountRepository.load({ email: fbData.email });
    }

    return new AuthenticationError();
  }
}
