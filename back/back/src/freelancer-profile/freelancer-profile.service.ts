
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { FreelancerProfile } from './entities/freelancer-profile.entity';

@Injectable()
export class FreelancerProfileService {
  constructor(
    @InjectRepository(FreelancerProfile)
    private readonly freelancerProfileRepository: Repository<FreelancerProfile>,
  ) {}

  async findByUserId(userId: number) {
  return this.freelancerProfileRepository.findOne({
    where: { user: { id: userId } },
    relations: ['user'],
  });
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
