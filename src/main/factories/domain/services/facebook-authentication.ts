import { FacebookAuthenticationService } from '../../../../domain/services';
import { makeFacebookApi, makeJwtTokenHandler } from '../../infra/gateways';
import { makePgUserAccountRepository } from '../../infra/repositories';

export const makeFacebookAuthenticationService =
  (): FacebookAuthenticationService => {
    return new FacebookAuthenticationService(
      makeFacebookApi(),
      makePgUserAccountRepository(),
      makeJwtTokenHandler(),
    );
  };
