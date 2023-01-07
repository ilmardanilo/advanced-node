import { FacebookAuthenticationService } from '../../../src/data/services/';
import { AuthenticationError } from '../../../src/domain/errors';
import { LoadFacebookUserApi } from '../../../src/data/contracts/api';

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  callsCount = 0;
  result = undefined;

  async loadUser(
    params: LoadFacebookUserApi.Params,
  ): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token;
    this.callsCount++;
    return this.result;
  }
}

describe('FacebookAuthenticationService', () => {
  it('Should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    await sut.perform({ token: 'any_token' });

    expect(loadFacebookUserApi.token).toBe('any_token');
    expect(loadFacebookUserApi.callsCount).toBe(1);
  });

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();
    loadFacebookUserApi.result = undefined;
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    const authResult = await sut.perform({ token: 'any_token' });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
