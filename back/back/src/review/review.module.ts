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
import { NotificationModule } from 'src/notification/notification.module'; // Import the module
import { ClientProfileModule } from 'src/client-profile/client-profile.module';
import { FreelancerProfileModule } from 'src/freelancer-profile/freelancer-profile.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, ClientProfile, FreelancerProfile, User, Mission, Badge]),
    NotificationModule, // Correct: Import the module to access NotificationService
    ClientProfileModule, // Import ClientProfileModule if you need to use ClientProfileService or ClientProfileRepository
    FreelancerProfileModule, // Import FreelancerProfileModule if you need to use FreelancerProfileService or FreelancerProfileRepository
    
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}