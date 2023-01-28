import { FacebookApi } from '../../src/infra/gateways';
import { AxiosHttpClient } from '../../src/infra/gateways';
import { env } from '../../src/main/config/env';

describe('Facebook Api Integration Tests', () => {
  let axiosClient: AxiosHttpClient;
  let sut: FacebookApi;

  beforeEach(() => {
    axiosClient = new AxiosHttpClient();
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret,
    );
  });
  it('should return a Facebook User if token is valid', async () => {
    const fbUser = await sut.loadUser({
      token: env.facebookApi.accessToken,
    });

    expect(fbUser).toEqual({
      facebookId: '105513015776378',
      name: 'Ilmar Teste',
      email: 'ilmar_pvzvkwx_teste@tfbnw.net',
    });
  });

  it('should return a undefined if token is invalid', async () => {
    const fbUser = await sut.loadUser({
      token: 'invalid',
    });

    expect(fbUser).toBeUndefined();
  });
});
