import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './entities/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { User } from 'src/user/entities/user.entity';
import { Mission } from 'src/mission/entities/mission.entity';
import { Badge } from 'src/badge/entities/badge.entity';
import { FreelancerProfileModule } from 'src/freelancer-profile/freelancer-profile.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review,ClientProfile,FreelancerProfile,User, Mission,Badge]),FreelancerProfileModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
