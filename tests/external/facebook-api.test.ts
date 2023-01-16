import { FacebookApi } from '../../src/infra/apis';
import { AxiosHttpClient } from '../../src/infra/http';
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
      token:
        'EAAKZAAxGMAAcBADU5QN5atiZCVeDLF1dSw7VcdSZB51KFMXmlujjiNrKZABAlPlozslzn5CZAHS8RJMHMtVI6P3pianloqhhCQg0NoD8bRZAw5r7S7bIr8wbtqQvymKpnYVgy5aNUIytSkryh4mZByVz08T2LhX0KYtI3rVyhyl86BSJwaiqoSUvYQgP7IMf69lRUGDn3X6IaqXTLHJY9YL',
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
