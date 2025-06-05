import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async getReviewsFreelancer(userId: number): Promise<Review[]> {
  return this.reviewRepository
    .createQueryBuilder('review')
    .leftJoinAndSelect('review.reviewedUser', 'reviewedUser')
    .leftJoinAndSelect('review.reviewer', 'reviewer')
    .leftJoinAndSelect('review.mission', 'mission')
    .leftJoinAndSelect('mission.selectedFreelancer', 'freelancerProfile')
    .leftJoinAndSelect('freelancerProfile.user', 'freelancerUser')
    .where('freelancerUser.id = :userId', { userId })
    .andWhere('reviewedUser.id = :userId', { userId })
    .orderBy('review.date', 'DESC')
    .limit(3)
    .getMany(); 

}

async getReviewsClient(userId: number): Promise<Review[]> {
  return this.reviewRepository
    .createQueryBuilder('review')
    .leftJoinAndSelect('review.reviewedUser', 'reviewedUser')
    .leftJoinAndSelect('review.reviewer', 'reviewer')
    .leftJoinAndSelect('review.mission', 'mission')
    .leftJoinAndSelect('mission.client', 'client')
    .leftJoinAndSelect('client.user', 'clientUser')
    .where('clientUser.id = :userId', { userId })
    .andWhere('reviewedUser.id = :userId', { userId })
    .orderBy('review.date', 'DESC')
    .limit(3)
    .getMany(); 

}
}
