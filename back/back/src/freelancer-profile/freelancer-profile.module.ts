import { Module } from '@nestjs/common';
import { FreelancerProfileService } from './freelancer-profile.service';
import { FreelancerProfileController } from './freelancer-profile.controller';

@Module({
  controllers: [FreelancerProfileController],
  providers: [FreelancerProfileService],
})
export class FreelancerProfileModule {}
