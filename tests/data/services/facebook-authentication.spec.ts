import { FacebookAuthenticationService } from '../../../src/data/services/';
import { AuthenticationError } from '../../../src/domain/errors';
import { LoadFacebookUserApi } from '../../../src/data/contracts/api';
import {
  LoadUserAccountRepository,
  CreateFacebookAccountRepository,
} from '../../../src/data/contracts/repository';
import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService;
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepository: MockProxy<
    LoadUserAccountRepository & CreateFacebookAccountRepository
  >;
  const token = 'any_token';

  beforeEach(() => {
    facebookApi = mock();
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id',
    });
    userAccountRepository = mock();
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepository);
  });

  it('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('Should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token });

    expect(userAccountRepository.load).toHaveBeenCalledWith({
      email: 'any_fb_email',
    });
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it('Should call CreateFacebookAccountRepository when LoadUserAccountRepository returns undefined', async () => {
    await sut.perform({ token });
    userAccountRepository.load.mockResolvedValueOnce(undefined);

    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id',
    });
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1);
  });
});
