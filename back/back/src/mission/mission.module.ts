import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionResolver } from './mission.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './entities/mission.entity';
import { User } from 'src/user/entities/user.entity';
import { MissionController } from './mission.controller';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Mission, User,FreelancerProfile])],
  controllers: [MissionController],
  providers: [MissionResolver, MissionService],
})
export class MissionModule {}
