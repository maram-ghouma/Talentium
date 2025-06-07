import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionResolver } from './mission.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './entities/mission.entity';
import { User } from 'src/user/entities/user.entity';
import { MissionController } from './mission.controller';
import { Task } from './entities/task.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Mission, User, Task])],
  providers: [MissionResolver, MissionService],
  controllers: [MissionController],
})
export class MissionModule {}
