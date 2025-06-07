import { Module } from '@nestjs/common';
import { FreelancerProfileService } from './freelancer-profile.service';
import { FreelancerProfileController } from './freelancer-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelancerProfile } from './entities/freelancer-profile.entity';
import { User } from 'src/user/entities/user.entity';
import { Mission } from 'src/mission/entities/mission.entity';
import { Review } from 'src/review/entities/review.entity';


@Module({
  imports: [TypeOrmModule.forFeature([FreelancerProfile,User, Mission, Review])], 
  controllers: [FreelancerProfileController],
  providers: [FreelancerProfileService],
  exports: [FreelancerProfileService,TypeOrmModule], 
})
export class FreelancerProfileModule {}
