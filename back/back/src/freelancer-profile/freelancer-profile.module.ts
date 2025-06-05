import { Module } from '@nestjs/common';
import { FreelancerProfileService } from './freelancer-profile.service';
import { FreelancerProfileController } from './freelancer-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelancerProfile } from './entities/freelancer-profile.entity';
import { User } from 'src/user/entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([FreelancerProfile,User])], 
  controllers: [FreelancerProfileController],
  providers: [FreelancerProfileService],
  exports: [FreelancerProfileService,TypeOrmModule], 
})
export class FreelancerProfileModule {}
