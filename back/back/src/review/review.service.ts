import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { User } from 'src/user/entities/user.entity';
import { Badge, BadgeType } from 'src/badge/entities/badge.entity';
import { Mission } from 'src/mission/entities/mission.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { FreelancerProfileService } from 'src/freelancer-profile/freelancer-profile.service';

export interface ReviewedUser {
  id: number;
  name: string;
  image: string;
}

export interface reviewMission{
    id: number;
    title: string;
    description: string;
    price: number;
    client: ReviewedUser;
    selectedFreelancer: ReviewedUser;
}

@Injectable()
export class ReviewService {

  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
      @InjectRepository(ClientProfile)
    private readonly clientProfileRepository: Repository<ClientProfile>,
      @InjectRepository(FreelancerProfile)
    private readonly freelancerProfileRepository: Repository<FreelancerProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,
    @InjectRepository(Badge)
    private readonly badgeRepository: Repository<Badge>,
    private readonly freelancerProfileService: FreelancerProfileService,

  ) {}

  async getReviewMissionById(missionId: number): Promise<reviewMission | null> {
  const mission = await this.missionRepository.findOne({
    where: { id: missionId },
    relations: ['selectedFreelancer', 'selectedFreelancer.user', 'client', 'client.user']
  });

  if (!mission) {
    return null;
  }

  const clientProfile = mission.client;
  const freelancerProfile = mission.selectedFreelancer;
  

  if (!clientProfile?.user || !freelancerProfile?.user) {
    throw new Error('Informations manquantes sur le client ou le freelancer');
  }

  const client: ReviewedUser = {
    id: clientProfile.id, 
    name: clientProfile.user.username || 'Client',
    image: clientProfile.user.imageUrl || '',
  };

  const selectedFreelancer: ReviewedUser = {
    id: freelancerProfile.id, 
    name: freelancerProfile.user.username || 'Freelancer',
    image: freelancerProfile.user.imageUrl || '',
  };

  return {
    id: mission.id,
    title: mission.title,
    description: mission.description,
    price: mission.price,
    client: client,
    selectedFreelancer: selectedFreelancer,
  };
}

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
    .select('review.reviewedUserId', 'userId')
    .addSelect('AVG(review.stars)', 'avgRating')
    .innerJoin(FreelancerProfile, 'freelancer', 'freelancer.userId = review.reviewedUserId')
    .groupBy('review.reviewedUserId')
    .orderBy('avgRating', 'DESC')
    .limit(limit)
    .getRawMany();

  

    

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




  async createReview(createReviewDto: CreateReviewDto) {
  const mission = await this.missionRepository.findOne({
    where: { id: createReviewDto.missionId },
    relations: ['client', 'client.user', 'selectedFreelancer', 'selectedFreelancer.user']
  });

  if (!mission) {
    throw new Error('Mission non trouvée');
  }

 
  
  const reviewer = await this.clientProfileRepository.findOne({ 
    where: { id: createReviewDto.reviewerId },
    relations: ['user']
  });

  if (!reviewer) {
    throw new Error('Utilisateur reviewer non trouvé');
  }

  let isClientReviewing = false;
  let isFreelancerReviewing = false;

  if (mission.client?.id === reviewer.id) {
    isClientReviewing = true;
  }

  if (mission.selectedFreelancer?.id === reviewer.id) {
    isFreelancerReviewing = true;
  }
;


  if (!isClientReviewing && !isFreelancerReviewing) {
    throw new Error('Seuls les participants à la mission peuvent laisser un avis');
  }

  
  const existingReview = await this.reviewRepository.findOne({
    where: {
      reviewer: { id: createReviewDto.reviewerId },
      mission: { id: createReviewDto.missionId }
    }
  });

  if (existingReview) {
    throw new Error('Vous avez déjà laissé un avis pour cette mission');
  }

  const reviewedUser = await this.freelancerProfileRepository.findOne({ 
    where: { id: createReviewDto.reviewedUserId }, 
    relations: ['user']
  });

  if (!reviewedUser) {
    throw new Error('Utilisateur à évaluer non trouvé');
  }

  const review = this.reviewRepository.create({
    stars: createReviewDto.stars,
    comment: createReviewDto.comment,
    date: new Date().toISOString().split('T')[0],
    reviewer: { id: reviewer.user.id },      
    reviewedUser: { id: reviewedUser.user.id }, 



    mission: { id: createReviewDto.missionId },               
  });

  const savedReview = await this.reviewRepository.save(review);

  if (reviewedUser && reviewedUser.user.currentRole === 'freelancer') {
    await this.updateFreelancerBadges(reviewedUser.id);
  }


  return savedReview;
}

  /*async calculateUserRating(userId: number) {
    const reviews = await this.reviewRepository.find({
      where: { reviewedUser: { id: userId } }
    });

    if (reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    const averageRating = Math.round((totalStars / reviews.length) * 10) / 10;

    return {
      averageRating,
      totalReviews: reviews.length,
      reviews: reviews.map(review => ({
        stars: review.stars,
        comment: review.comment,
        date: review.date,
        reviewer: review.reviewer.username
      }))
    };
  }
*/
  async updateFreelancerBadges(freelancerId: number) {
    
    const freelancer = await this.freelancerProfileRepository.findOne({
      where: { user: { id: freelancerId } },
      relations: ['user', 'user.badges']
    });

    if (!freelancer) {
      throw new Error('Profil freelancer non trouvé');
    }

    //const ratingData = await this.calculateUserRating(freelancerId);
    const ratingData =await this.freelancerProfileService.getFreelancerStats(freelancerId);
    const averageRating = ratingData.averageRating;
    const completedMissions = ratingData.completedMissions || 0;
    
    const badgesToAssign: BadgeType[] = [];

    if (completedMissions >= 1) {
      badgesToAssign.push(BadgeType.BEGINNER);
    }

    if (completedMissions > 10 && averageRating >= 4.0) {
      badgesToAssign.push(BadgeType.ADVANCED);
    }

    if (completedMissions > 50 && averageRating >= 4.5) {
      badgesToAssign.push(BadgeType.CERTIFIED);
    }

    const existingBadgeTypes = freelancer.user.badges.map(badge => badge.type);

    for (const badgeType of badgesToAssign) {
      if (!existingBadgeTypes.includes(badgeType)) {
        const badge = await this.badgeRepository.findOne({
          where: { type: badgeType }
        });

        if (badge) {
          freelancer.user.badges.push(badge);
        }
      }
    }

    await this.userRepository.save(freelancer.user);

    return {
      completedMissions,
      averageRating,
      badgesAssigned: badgesToAssign,
      message: `Badges mis à jour pour le freelancer ${freelancer.user.username}`
    };
  }

  
  async getUserReviews(userId: number, page: number = 1, limit: number = 10) {
    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: { reviewedUser: { id: userId } },
      relations: ['reviewer', 'mission'],
      order: { date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit
    });

    return {
      reviews: reviews.map(review => ({
        id: review.id,
        stars: review.stars,
        comment: review.comment,
        date: review.date,
        reviewer: {
          id: review.reviewer.id,
          username: review.reviewer.username
        },
        mission: {
          id: review.mission.id,
          title: review.mission.title
        }
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    };
  }

  
 /* async getFreelancerProfileWithStats(freelancerId: number) {
    const freelancer = await this.freelancerProfileRepository.findOne({
      where: { user: { id: freelancerId } },
      relations: ['user', 'user.badges', 'selectedMissions']
    });

    if (!freelancer) {
      throw new Error('Profil freelancer non trouvé');
    }

    const ratingData = await this.calculateUserRating(freelancerId);
    const completedMissions = freelancer.selectedMissions.filter(
      mission => mission.status === 'completed'
    ).length;

    return {
      freelancer: {
        id: freelancer.id,
        user: {
          id: freelancer.user.id,
          username: freelancer.user.username,
          email: freelancer.user.email,
          imageUrl: freelancer.user.imageUrl
        },
        badges: freelancer.user.badges,
        statistics: {
          completedMissions,
          averageRating: ratingData.averageRating,
          totalReviews: ratingData.totalReviews,
          inProgressMissions: freelancer.selectedMissions.filter(
            mission => mission.status === 'in_progress'
          ).length
        }
      },
      recentReviews: (ratingData.reviews ?? []).slice(0, 5) // 5 avis les plus récents
    };
  }*/
}