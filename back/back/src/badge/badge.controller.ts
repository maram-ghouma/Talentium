import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { Badge, BadgeType } from './entities/badge.entity';

@Controller('badges')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  // GET /badges - Get all badges
  @Get()
  async findAll(): Promise<Badge[]> {
    return this.badgeService.findAll();
  }

  // GET /badges/:id - Get badge by ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Badge> {
    return this.badgeService.findOne(id);
  }

  // GET /badges/type/:type - Get badge by type
  @Get('type/:type')
  async findByType(@Param('type') type: BadgeType): Promise<Badge> {
    return this.badgeService.findByType(type);
  }

  // POST /badges/setup - Create predefined badges (run once during setup)
  @Post('setup')
  async setupBadges(): Promise<Badge[]> {
    return this.badgeService.createPredefinedBadges();
  }

  // POST /badges/assign - Assign badge to user
  @Post('assign')
  async assignBadge(
    @Body() assignBadgeDto: { userId: number; badgeType: BadgeType }
  ): Promise<Badge> {
    return this.badgeService.assignBadgeToUser(
      assignBadgeDto.userId,
      assignBadgeDto.badgeType
    );
  }

  // POST /badges/remove - Remove badge from user
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