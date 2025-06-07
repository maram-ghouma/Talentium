import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionResolver } from './mission.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './entities/mission.entity';
import { User } from 'src/user/entities/user.entity';
import { MissionController } from './mission.controller';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { Dispute } from 'src/dispute/entities/dispute.entity';
import { Review } from 'src/review/entities/review.entity';
import { Application } from 'src/application/entities/application.entity';
import { Task } from './entities/task.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Mission, User,FreelancerProfile,Dispute,ClientProfile,Review,Application, Task])],
  providers: [MissionResolver, MissionService],
  controllers: [MissionController],
  exports: [MissionService, TypeOrmModule],

})
export class MissionModule {}
