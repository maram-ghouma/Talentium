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
    .leftJoinAndSelect('review.reviewedUser', 'reviewedUser') // the freelancer being reviewed
    .leftJoinAndSelect('review.reviewer', 'reviewer')         // the client who wrote the review
    .leftJoinAndSelect('review.mission', 'mission')
    .where('reviewedUser.id = :userId', { userId })           // filter by reviewed freelancer
    .orderBy('review.date', 'DESC')
    .limit(3)
    .getMany();

}

async getReviewsClient(userId: number): Promise<Review[]> {
   return this.reviewRepository
    .createQueryBuilder('review')
    .leftJoinAndSelect('review.reviewedUser', 'reviewedUser') // the client being reviewed
    .leftJoinAndSelect('review.reviewer', 'reviewer')         // the freelancer writing the review
    .leftJoinAndSelect('review.mission', 'mission')
    .where('reviewedUser.id = :userId', { userId }) // ✅ client is the reviewed user
    .orderBy('review.date', 'DESC')
    .limit(3)
    .getMany();

}

 async getTopRatedClients(limit: number = 3) {
    const topClients = await this.reviewRepository
  .createQueryBuilder('review')
  .select('reviewedUser.id', 'userId')
  .addSelect('AVG(review.stars)', 'avgRating')
  .innerJoin('review.reviewedUser', 'reviewedUser') // explicitly join the reviewed user
  .innerJoin('review.mission', 'mission')
  .innerJoin('mission.client', 'client')
  .innerJoin('client.user', 'clientUser')
  .where('reviewedUser.id = clientUser.id') // make sure reviewed user is client of the mission
  .groupBy('reviewedUser.id')
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
  .select('reviewedUser.id', 'userId')
  .addSelect('AVG(review.stars)', 'avgRating')
  .innerJoin('review.reviewedUser', 'reviewedUser')    // the reviewed user
  .innerJoin('review.mission', 'mission')              // the mission related to review
  .innerJoin('mission.selectedFreelancer', 'freelancer')       // the freelancer for the mission
  .innerJoin('freelancer.user', 'freelancerUser')      // user entity for freelancer if applicable
  .where('reviewedUser.id = freelancerUser.id')        // ensure reviewed user is the freelancer for the mission
  .groupBy('reviewedUser.id')
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
