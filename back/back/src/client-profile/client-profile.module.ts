import { Module } from '@nestjs/common';
import { ClientProfileService } from './client-profile.service';
import { ClientProfileController } from './client-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientProfile } from './entities/client-profile.entity';
import { User } from 'src/user/entities/user.entity';
import { Review } from 'src/review/entities/review.entity';
import { Mission } from 'src/mission/entities/mission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientProfile, User, Review, Mission])],
  controllers: [ClientProfileController],
  providers: [ClientProfileService],
  exports: [ClientProfileService], 
})
export class ClientProfileModule {}
