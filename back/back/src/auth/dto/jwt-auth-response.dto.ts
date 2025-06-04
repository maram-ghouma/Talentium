import { User } from '../../user/entities/user.entity';

export class JwtAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'password'>;
}
