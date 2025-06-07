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
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { Review } from 'src/review/entities/review.entity';
import { Mission } from 'src/mission/entities/mission.entity';
import { Dispute } from 'src/dispute/entities/dispute.entity';

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
    PaymentModule,
    TypeOrmModule.forFeature([User,Dispute]), 
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
