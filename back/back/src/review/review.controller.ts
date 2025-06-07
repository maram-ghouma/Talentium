import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/RoleGuard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('myReviewsFreelancer')
  async getReviewsFreelancer(@CurrentUser() user: any, @Query('id') id?: number) {
    return this.reviewService.getReviewsFreelancer(id ?? user.userId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('myReviewsClient')
  async getReviewsClient(@CurrentUser() user: any, @Query('id') id?: number) {
    return this.reviewService.getReviewsClient(id ?? user.userId);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('top-rated-clients')
  async getTopRatedClients(@Query('limit') limit: number = 3) {
    const result = await this.reviewService.getTopRatedClients(limit);
    return result;
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('top-rated-freelancers')
  async getTopRatedFreelancers(@Query('limit') limit: number = 3) {
    const result = await this.reviewService.getTopRatedFreelancers(limit);
    return result;
  }
}
