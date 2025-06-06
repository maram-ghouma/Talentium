import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
      @InjectRepository(ClientProfile)
    private readonly clientProfileRepository: Repository<ClientProfile>,
      @InjectRepository(FreelancerProfile)
    private readonly freelancerProfileRepository: Repository<FreelancerProfile>,
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

 async getTopRatedClients(limit: number = 3) {
    const topClients = await this.reviewRepository
      .createQueryBuilder('review')
      .select('review.reviewedUserId', 'userId')
      .addSelect('AVG(review.stars)', 'avgRating')
      .innerJoin(ClientProfile, 'client', 'client.userId = review.reviewedUserId')
      .groupBy('review.reviewedUserId')
      .orderBy('avgRating', 'DESC')
      .limit(limit)
      .getRawMany();

    const enriched = await Promise.all(
      topClients.map(async (entry) => {
        const profile = await this.clientProfileRepository.findOne({
          where: { user: { id: entry.userId } },
          relations: ['user'],
        });
        return {
          username: profile?.user.username,
          averageRating: parseFloat(entry.avgRating),
          industry: profile?.industry,
        };
      }),
    );

    return enriched;
  }

  async getTopRatedFreelancers(limit: number = 3) {
  const topFreelancers = await this.reviewRepository
    .createQueryBuilder('review')
    .select('review.reviewedUserId', 'userId')
    .addSelect('AVG(review.stars)', 'avgRating')
    .innerJoin(FreelancerProfile, 'freelancer', 'freelancer.userId = review.reviewedUserId')
    .groupBy('review.reviewedUserId')
    .orderBy('avgRating', 'DESC')
    .limit(limit)
    .getRawMany();

  // Enrich with user and freelancer profile
  const enriched = await Promise.all(
    topFreelancers.map(async (entry) => {
      const profile = await this.freelancerProfileRepository.findOne({
        where: { user: { id: entry.userId } },
        relations: ['user'],
      });
      return {
        username: profile?.user.username,
        averageRating: parseFloat(entry.avgRating),
        hourlyRate: profile?.hourlyRate,
      };
    }),
  );

  return enriched;
}
}
