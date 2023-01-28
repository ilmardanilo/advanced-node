import { FacebookLoginController } from '../../../../application/controllers';
import { makeFacebookAuthenticationService } from '../../domain/services';

export const makeFacebookLoginController = (): FacebookLoginController => {
  return new FacebookLoginController(makeFacebookAuthenticationService());
};
