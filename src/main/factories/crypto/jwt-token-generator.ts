import { JwtTokenGenerator } from '../../../infra/crypto';
import { env } from '../../config/env';

export const makeJwtTokenGenerator = (): JwtTokenGenerator => {
  return new JwtTokenGenerator(env.jwtSecret);
};
