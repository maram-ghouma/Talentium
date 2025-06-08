import { Module } from '@nestjs/common';
import { DisputeService } from './dispute.service';
import { DisputeController } from './dispute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispute } from './entities/dispute.entity';
import { MissionModule } from 'src/mission/mission.module';
import { MissionService } from 'src/mission/mission.service';
import { Mission } from 'src/mission/entities/mission.entity';

import { NotificationModule } from '../notification/notification.module'; // Import the module
import {User} from '../user/entities/user.entity'; // Import User entity if needed
import { UserModule } from '../user/user.module'; // Import UserModule if you need to use UserService or UserRepository
import { ClientProfile } from '../client-profile/entities/client-profile.entity'; // Import ClientProfile if needed
import { FreelancerProfile } from '../freelancer-profile/entities/freelancer-profile.entity'; // Import FreelancerProfile if needed
import { ClientProfileModule } from '../client-profile/client-profile.module'; // Import ClientProfileModule if you need to use ClientProfileService or ClientProfileRepository
import { FreelancerProfileModule } from '../freelancer-profile/freelancer-profile.module'; // Import FreelancerProfileModule if you need to use FreelancerProfileService or FreelancerProfileRepository

@Module({
  imports: [
    TypeOrmModule.forFeature([Dispute,Mission,User, User, ClientProfile, FreelancerProfile,Mission,User]), // Import the Dispute entity and User entity if needed
    NotificationModule, // Correct: Import the module to access NotificationService
    UserModule, // Import UserModule if you need to use UserService or UserRepository
    ClientProfileModule, // Import ClientProfileModule if you need to use ClientProfileService or ClientProfileRepository
    FreelancerProfileModule, // Import FreelancerProfileModule if you need to use FreelancerProfileService or FreelancerProfileRepository
  ],
  controllers: [DisputeController],
  providers: [DisputeService],
})
export class DisputeModule {}