import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DisputeService } from './dispute.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/RoleGuard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Dispute } from './entities/dispute.entity';
import { MissionService } from 'src/mission/mission.service';

@Controller('dispute')
export class DisputeController {
  constructor(private readonly disputeService: DisputeService
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('stats')
  async getDisputeStats() {
    const stats = await this.disputeService.getDisputeStats();
    return stats;
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('opened-disputes')
  async getOpenDisputesWithProfiles() {
    return this.disputeService.getOpenDisputesWithProfiles();
  }
    @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('resolved-disputes')
  async getResolvedDisputesWithProfiles() {
    return this.disputeService.getResolvedDisputesWithProfiles();
  }
  @Patch('dispute-resolve')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async resolveDispute(
    @Body('resolution') resolution: string,
    @Body('disputeId') disputeId: number,
  ) {
    return this.disputeService.resolveDispute(+disputeId, resolution);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('freelancer','client')
  @Post('createFreelancer')
  async create(
    @Body() createDisputeDto: CreateDisputeDto,
    @CurrentUser() user: any,
  ): Promise<Dispute> {
    return this.disputeService.createDisputeFreelancer(createDisputeDto, user.userId);
  }
}
