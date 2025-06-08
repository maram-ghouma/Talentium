import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispute } from 'src/dispute/entities/dispute.entity';
import { Mission } from 'src/mission/entities/mission.entity';
import { User } from 'src/user/entities/user.entity';
import { PaymentService } from './payment.service';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { PaymentResolver } from './payment.resolver';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { PaymentController } from './payment.controller';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Mission, User, Dispute,Invoice,FreelancerProfile,ClientProfile])],
    providers: [PaymentService, PaymentResolver],
  exports: [PaymentService, PaymentResolver],
  controllers: [PaymentController],
  
})
export class PaymentModule {}
