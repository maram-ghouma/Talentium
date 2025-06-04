import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispute } from 'src/dispute/entities/dispute.entity';
import { Mission } from 'src/mission/entities/mission.entity';
import { User } from 'src/user/entities/user.entity';
import { PaymentService } from './payment.service';
import { Invoice } from 'src/invoice/entities/invoice.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Mission, User, Dispute,Invoice])],
    providers: [PaymentService],
  
})
export class PaymentModule {}
