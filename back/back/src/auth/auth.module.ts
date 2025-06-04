import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service'; 
import { JwtStrategy } from './strategies/jwt.strategy'; 
import { UserModule } from 'src/user/user.module';
import { ClientProfileModule } from 'src/client-profile/client-profile.module';
import { FreelancerProfileModule } from 'src/freelancer-profile/freelancer-profile.module';

@Module({
  imports: [ 
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'temporary_secretkey',
      signOptions: { expiresIn: '3d' }, 
    }),
    UserModule,
    ClientProfileModule,
    FreelancerProfileModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
