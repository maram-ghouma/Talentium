
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { FreelancerProfile } from './entities/freelancer-profile.entity';
import { UpdateFreelancerProfileDto } from './dto/update-freelancer-profile.dto';
import { Mission } from 'src/mission/entities/mission.entity';
import { Review } from 'src/review/entities/review.entity';

@Injectable()
export class FreelancerProfileService {
  constructor(
    @InjectRepository(FreelancerProfile)
    private readonly freelancerProfileRepository: Repository<FreelancerProfile>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
     @InjectRepository(Mission)
    private missionRepo: Repository<Mission>,
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
  ) {
    
  }



async findByUserId(userId: number): Promise<FreelancerProfile> {
  const profile = await this.freelancerProfileRepository.findOne({
    where: { user: { id: userId } },
    relations: ['user'],
  });

  if (!profile) {
    throw new NotFoundException(`Freelancer profile not found for user ID ${userId}`);
  }

  return profile;
}

async createProfileForUser(user: User,clientData: { phoneNumber?: string; country?: string }) {
  const profile = this.freelancerProfileRepository.create({
    user: user,
    phoneNumber: clientData.phoneNumber ?? undefined,
    country: clientData.country ?? undefined,
  });

  return this.freelancerProfileRepository.save(profile);
}

async updateFreelancerProfile(freelancerId: number, updateDto: UpdateFreelancerProfileDto) {
    const profile = await this.freelancerProfileRepository
    
  .createQueryBuilder('profile')
  .leftJoinAndSelect('profile.user', 'user')
  .where('user.id = :freelancerId', { freelancerId })
  .getOne();
    if (!profile) {
      throw new NotFoundException('Freelancer profile not found');
    }

    // Update user data
    if (updateDto.username || updateDto.email || updateDto.imageUrl || updateDto.bio) {
      profile.user.username = updateDto.username ?? profile.user.username;
      profile.user.email = updateDto.email ?? profile.user.email;
      profile.user.imageUrl = updateDto.imageUrl ?? profile.user.imageUrl;
        profile.user.imageUrl = updateDto.imageUrl ?? profile.user.imageUrl;
      await this.userRepo.save(profile.user);
    }

    // Update profile data
    profile.bio = updateDto.bio ?? profile.bio;
    profile.hourlyRate = updateDto.hourlyRate ?? profile.hourlyRate;
    profile.country = updateDto.country ?? profile.country;
    profile.github = updateDto.github ?? profile.github;
    profile.phoneNumber = updateDto.phoneNumber ?? profile.phoneNumber;
    profile.linkedIn = updateDto.linkedIn ?? profile.linkedIn;
    profile.skills = updateDto.skills ?? profile.skills;
    return await this.freelancerProfileRepository.save(profile);
  }

  async getFreelancerStats(userId: number) {
  const freelancerProfile = await this.freelancerProfileRepository
    .createQueryBuilder('profile')
    .leftJoinAndSelect('profile.user', 'user')
    .where('user.id = :userId', { userId })
    .getOne();

  if (!freelancerProfile) {
    throw new NotFoundException('Freelancer profile not found');
  }

  const totalMissions = await this.missionRepo.count({
    where: { selectedFreelancer: { id: freelancerProfile.id } },
  });

  const missionsInProgress = await this.missionRepo.count({
    where: {
      selectedFreelancer: { id: freelancerProfile.id },
      status: 'in_progress',
    },
  });

  const completedMissions = await this.missionRepo.count({
    where: {
      selectedFreelancer: { id: freelancerProfile.id },
      status: 'completed',
    },
  });

  const avgRating = await this.reviewRepo
    .createQueryBuilder('review')
    .select('AVG(review.stars)', 'average')
    .innerJoin('review.mission', 'mission')
  .innerJoin('mission.selectedFreelancer', 'freelancer')
  .innerJoin('freelancer.user', 'freelancerUser')
  .where('freelancerUser.id = :userId', { userId })
  .andWhere('review.reviewedUser = :userId', { userId })
    .getRawOne();

  return {
    averageRating: parseFloat(avgRating.average) || 0,
    totalMissions,
    missionsInProgress,
    completedMissions,
  };
}



}
