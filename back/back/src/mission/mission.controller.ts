import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { MissionService } from './mission.service';
import { User } from 'src/user/entities/user.entity';

@UseGuards(AuthGuard('jwt')) 
@Controller('mission')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get('my-client-missions')
  async getClientMissions(@CurrentUser() user: any, @Query('id') id?: number) {
    return this.missionService.getClientMissions(id ?? user.userId);
  }

  @Get('my-freelancer-missions')
  async getFreelancerMissions(@CurrentUser() user: any, @Query('id') id?: number) {
    return this.missionService.getFreelancerMissions(id ??user.userId);
  }

  @Get('admin-stats')
  async getAdminStats() {
    return this.missionService.getAdminStats();
  }

  @Get('my-missions-with-reviews')
  async getMyMissionsAsFreelancer(@CurrentUser() user: any) {
    return this.missionService.getFreelancerMissionsWithReviews(user.userId);
  }
}
