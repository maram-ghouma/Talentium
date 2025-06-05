import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt')) 
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('myReviewsFreelancer')
  async getReviewsFreelancer(@CurrentUser() user: any) {
    return this.reviewService.getReviewsFreelancer(user.userId);
  }
  @Get('myReviewsClient')
  async getReviewsClient(@CurrentUser() user: any) {
    return this.reviewService.getReviewsClient(user.userId);
  }
}
