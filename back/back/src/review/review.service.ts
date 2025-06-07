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




  // 1. CRÉER UNE ÉVALUATION
  async createReview(
   createReviewDto: CreateReviewDto
  ) {
    // Vérifier que la mission est terminée
    const mission = await this.missionRepository.findOne({
      where: { id: createReviewDto.missionId },
      relations: ['client', 'selectedFreelancer']
    });

    if (!mission || mission.status !== 'completed') {
      throw new Error('La mission doit être terminée pour laisser un avis');
    }

    // Vérifier que le reviewer fait partie de la mission
    const isClientReviewing = mission.client.id === createReviewDto.reviewerId;
    const isFreelancerReviewing = mission.selectedFreelancer?.id === createReviewDto.reviewerId;

    if (!isClientReviewing && !isFreelancerReviewing) {
      throw new Error('Seuls les participants à la mission peuvent laisser un avis');
    }

    // Vérifier qu'il n'y a pas déjà d'avis pour cette mission par ce reviewer
    const existingReview = await this.reviewRepository.findOne({
      where: {
        reviewer: { id: createReviewDto.reviewerId },
        mission: { id: createReviewDto.missionId }
      }
    });

    if (existingReview) {
      throw new Error('Vous avez déjà laissé un avis pour cette mission');
    }

    const reviewer = await this.userRepository.findOne({ where: { id: createReviewDto.reviewerId } });
    const reviewedUser = await this.userRepository.findOne({ where: { id: createReviewDto.reviewedUserId } });


    const review = this.reviewRepository.create({
        stars: createReviewDto.stars,
        comment: createReviewDto.comment,
        date: new Date().toISOString().split('T')[0], // Set the current date
        reviewer: { id: createReviewDto.reviewerId },      
        reviewedUser: { id: createReviewDto.reviewedUserId },
        mission: { id: createReviewDto.missionId },               
      });
    
    const savedReview = await this.reviewRepository.save(review);

    // Après avoir créé l'avis, vérifier et attribuer les badges si c'est un freelancer
    if (reviewedUser && reviewedUser.currentRole === 'freelancer') {
      await this.updateFreelancerBadges(reviewedUser.id);
    }

    return savedReview;
  }

  // 2. CALCULER LA MOYENNE DES ÉVALUATIONS
  async calculateUserRating(userId: number) {
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

  // 3. LOGIQUE D'ATTRIBUTION DES BADGES POUR FREELANCERS
  async updateFreelancerBadges(freelancerId: number) {
    const freelancer = await this.freelancerProfileRepository.findOne({
      where: { id: freelancerId },
      relations: ['selectedMissions', 'user', 'user.badges']
    });

    if (!freelancer) {
      throw new Error('Profil freelancer non trouvé');
    }

    // Compter les missions terminées
    const completedMissions = freelancer.selectedMissions.filter(
      mission => mission.status === 'completed'
    ).length;

    // Calculer la note moyenne
    const ratingData = await this.calculateUserRating(freelancerId);
    const averageRating = ratingData.averageRating;

    // Logique d'attribution des badges
    const badgesToAssign: BadgeType[] = [];

    // BEGINNER: 1 mission terminée
    if (completedMissions >= 1) {
      badgesToAssign.push(BadgeType.BEGINNER);
    }

    // ADVANCED: Plus de 10 missions terminées + note >= 4.0
    if (completedMissions > 10 && averageRating >= 4.0) {
      badgesToAssign.push(BadgeType.ADVANCED);
    }

    // CERTIFIED: Plus de 50 missions terminées + note >= 4.5
    if (completedMissions > 50 && averageRating >= 4.5) {
      badgesToAssign.push(BadgeType.CERTIFIED);
    }

    // Récupérer les badges existants
    const existingBadgeTypes = freelancer.user.badges.map(badge => badge.type);

    // Ajouter seulement les nouveaux badges
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

    // Sauvegarder les modifications
    await this.userRepository.save(freelancer.user);

    return {
      completedMissions,
      averageRating,
      badgesAssigned: badgesToAssign,
      message: `Badges mis à jour pour le freelancer ${freelancer.user.username}`
    };
  }

  // 4. OBTENIR LES ÉVALUATIONS D'UN UTILISATEUR
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

  // 5. OBTENIR LE PROFIL COMPLET AVEC STATISTIQUES
  async getFreelancerProfileWithStats(freelancerId: number) {
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
  }
}
