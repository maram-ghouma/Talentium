
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { FreelancerProfile } from './entities/freelancer-profile.entity';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class FreelancerProfileService {
  constructor(
    @InjectRepository(FreelancerProfile)
    private readonly freelancerProfileRepository: Repository<FreelancerProfile>,
  ) {}



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
}
