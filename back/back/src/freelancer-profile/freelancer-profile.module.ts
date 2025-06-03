import { Module } from '@nestjs/common';
import { FreelancerProfileService } from './freelancer-profile.service';
import { FreelancerProfileController } from './freelancer-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelancerProfile } from './entities/freelancer-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FreelancerProfile])], 
  controllers: [FreelancerProfileController],
  providers: [FreelancerProfileService],
  exports: [FreelancerProfileService], 
})
export class FreelancerProfileModule {}
