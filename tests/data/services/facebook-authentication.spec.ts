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
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>;
  let createFacebookAccountRepository: MockProxy<CreateFacebookAccountRepository>;
  const token = 'any_token';

  beforeEach(() => {
    loadFacebookUserApi = mock();
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id',
    });
    loadUserAccountRepository = mock();
    createFacebookAccountRepository = mock();
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepository,
      createFacebookAccountRepository,
    );
  });

  it('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('Should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token });

    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({
      email: 'any_fb_email',
    });
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it('Should call CreateFacebookAccountRepository when LoadUserAccountRepository returns undefined', async () => {
    await sut.perform({ token });
    loadUserAccountRepository.load.mockResolvedValueOnce(undefined);

    expect(
      createFacebookAccountRepository.createFromFacebook,
    ).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id',
    });
    expect(
      createFacebookAccountRepository.createFromFacebook,
    ).toHaveBeenCalledTimes(1);
  });
});
