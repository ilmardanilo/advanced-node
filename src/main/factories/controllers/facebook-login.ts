import { FacebookLoginController } from '../../../application/controllers';
import { makeFacebookAuthenticationService } from '../services';

export const makeFacebookLoginController = (): FacebookLoginController => {
  return new FacebookLoginController(makeFacebookAuthenticationService());
};
