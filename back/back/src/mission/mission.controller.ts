import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { MissionService } from './mission.service';
import { User } from 'src/user/entities/user.entity';

@UseGuards(AuthGuard('jwt')) 
@Controller('mission')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get('my-client-missions')
  async getClientMissions(@CurrentUser() user: any) {
    return this.missionService.getClientMissions(user.userId);
  }

  @Get('my-freelancer-missions')
  async getFreelancerMissions(@CurrentUser() user: any) {
    return this.missionService.getFreelancerMissions(user.userId);
  }
}
