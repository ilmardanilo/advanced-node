import { FacebookAuthenticationService } from '../../../data/services';
import { makeFacebookApi } from '../apis';
import { makeJwtTokenGenerator } from '../crypto';
import { makePgUserAccountRepository } from '../repositories';

export const makeFacebookAuthenticationService =
  (): FacebookAuthenticationService => {
    return new FacebookAuthenticationService(
      makeFacebookApi(),
      makePgUserAccountRepository(),
      makeJwtTokenGenerator(),
    );
  };
