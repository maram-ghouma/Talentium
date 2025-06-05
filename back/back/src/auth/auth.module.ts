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
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [ 
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey', 
      signOptions: { expiresIn: '3d' }, 
    }),
    UserModule,
    ClientProfileModule,
    FreelancerProfileModule,
    PaymentModule
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
