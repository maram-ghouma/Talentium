import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { Badge, BadgeType } from './entities/badge.entity';

@Controller('badges')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Get()
  async findAll(): Promise<Badge[]> {
    return this.badgeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Badge> {
    return this.badgeService.findOne(id);
  }

  @Get('type/:type')
  async findByType(@Param('type') type: BadgeType): Promise<Badge> {
    return this.badgeService.findByType(type);
  }

  @Post('setup')
  async setupBadges(): Promise<Badge[]> {
    return this.badgeService.createPredefinedBadges();
  }

  @Post('assign')
  async assignBadge(
    @Body() assignBadgeDto: { userId: number; badgeType: BadgeType }
  ): Promise<Badge> {
    return this.badgeService.assignBadgeToUser(
      assignBadgeDto.userId,
      assignBadgeDto.badgeType
    );
  }
 @Get('assign/:userId')
async getAssignedBadges(@Param('userId', ParseIntPipe) userId: number): Promise<Badge> {
  return this.badgeService.assignBadgeToUser(userId, BadgeType.CERTIFIED);
}

  @Post('remove')
  async removeBadge(
    @Body() removeBadgeDto: { userId: number; badgeType: BadgeType }
  ): Promise<{ message: string }> {
    await this.badgeService.removeBadgeFromUser(
      removeBadgeDto.userId,
      removeBadgeDto.badgeType
    );
    return { message: 'Badge removed successfully' };
  }
}