import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './entities/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review,ClientProfile,FreelancerProfile])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
