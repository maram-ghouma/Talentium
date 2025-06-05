
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { FreelancerProfile } from './entities/freelancer-profile.entity';

import { UpdateFreelancerProfileDto } from './dto/update-freelancer-profile.dto';


@Injectable()
export class FreelancerProfileService {
  constructor(
    @InjectRepository(FreelancerProfile)
    private readonly freelancerProfileRepository: Repository<FreelancerProfile>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
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

async createProfileForUser(user: User, clientData: { phoneNumber?: string; country?: string; stripeAccountId: string }) {
  const profile = this.freelancerProfileRepository.create({
    user: user,
    phoneNumber: clientData.phoneNumber ?? undefined,
    country: clientData.country ?? undefined,
    stripeAccountId: clientData.stripeAccountId,
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

}
