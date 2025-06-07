import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from './entities/interview.entity';
import { InterviewService } from './interview.service';
import { InterviewResolver } from './interview.resolver';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interview, FreelancerProfile, ClientProfile,User])],
  providers: [InterviewResolver, InterviewService],
})
export class InterviewModule {}
