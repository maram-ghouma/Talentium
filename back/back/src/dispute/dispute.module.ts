import { Module } from '@nestjs/common';
import { DisputeService } from './dispute.service';
import { DisputeController } from './dispute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispute } from './entities/dispute.entity';
import { MissionModule } from 'src/mission/mission.module';
import { MissionService } from 'src/mission/mission.service';
import { Mission } from 'src/mission/entities/mission.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dispute,Mission,User])],
  controllers: [DisputeController],
  providers: [DisputeService],
})
export class DisputeModule {}
