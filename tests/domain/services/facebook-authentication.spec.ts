import { FacebookAuthenticationService } from '../../../src/domain/services';
import { AuthenticationError } from '../../../src/domain/entities/errors';
import { LoadFacebookUserApi } from '../../../src/domain/contracts/api';
import { TokenGenerator } from '../../../src/domain/contracts/crypto';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '../../../src/domain/contracts/repository';
import { AccessToken, FacebookAccount } from '../../../src/domain/entities';
import { mocked } from 'ts-jest/utils';
import { mock, MockProxy } from 'jest-mock-extended';

jest.mock('../../../src/domain/entities/facebook-account');

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let crypto: MockProxy<TokenGenerator>;
  let userAccountRepository: MockProxy<
    LoadUserAccountRepository & SaveFacebookAccountRepository
  >;
  let sut: FacebookAuthenticationService;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    facebookApi = mock();
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id',
    });
    userAccountRepository = mock();
    userAccountRepository.load.mockResolvedValue(undefined);
    userAccountRepository.saveWithFacebook.mockResolvedValue({
      id: 'any_account_id',
    });
    crypto = mock();
    crypto.generateToken.mockResolvedValue('any_generated_token');
  });

  beforeEach(() => {
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepository,
      crypto,
    );
  });

  it('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('Should throw AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new AuthenticationError());
  });

  it('Should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token });

    expect(userAccountRepository.load).toHaveBeenCalledWith({
      email: 'any_fb_email',
    });
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it('Should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    await sut.perform({ token });

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith(
      mocked(FacebookAccount).mock.instances[0],
    );
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('Should call TokenGenerator with correct params', async () => {
    await sut.perform({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it('Should return an AccessToken on success', async () => {
    const authResult = await sut.perform({ token });

    expect(authResult).toEqual({ accessToken: 'any_generated_token' });
  });

  it('Should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'));

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error('fb_error'));
  });

  it('Should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_error'));

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error('load_error'));
  });

  it('Should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(
      new Error('save_error'),
    );

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error('save_error'));
  });

  it('Should rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'));

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error('token_error'));
  });
});
