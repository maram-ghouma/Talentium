import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from './entities/interview.entity';
import { InterviewService } from './interview.service';
import { InterviewResolver } from './interview.resolver';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { User } from 'src/user/entities/user.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { MissionModule } from 'src/mission/mission.module';
import {Mission } from 'src/mission/entities/mission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interview, FreelancerProfile, ClientProfile,User, Mission]),
    NotificationModule,
    MissionModule,],
  providers: [InterviewResolver, InterviewService],
})
export class InterviewModule {}
