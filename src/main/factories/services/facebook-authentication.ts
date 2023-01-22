import { FacebookAuthenticationService } from '../../../domain/services';
import { makeFacebookApi } from '../apis';
import { makeJwtTokenHandler } from '../crypto';
import { makePgUserAccountRepository } from '../repositories';

export const makeFacebookAuthenticationService =
  (): FacebookAuthenticationService => {
    return new FacebookAuthenticationService(
      makeFacebookApi(),
      makePgUserAccountRepository(),
      makeJwtTokenHandler(),
    );
  };
