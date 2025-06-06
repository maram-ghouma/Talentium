
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProfile } from './entities/client-profile.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { saveFile } from 'src/common/helpers/image-upload.helper';
import { Mission } from 'src/mission/entities/mission.entity';
import { Review } from 'src/review/entities/review.entity';

@Injectable()
export class ClientProfileService {
  constructor(
    @InjectRepository(ClientProfile)
    private readonly clientProfileRepository: Repository<ClientProfile>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Mission)
    private missionRepo: Repository<Mission>,
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
  ) {}

  async findByUserId(userId: number) {
  return this.clientProfileRepository.findOne({
    where: { user: { id: userId } },
    relations: ['user'],
  });
}
async createProfileForUser(user: User,clientData: { phoneNumber?: string; country?: string }) {
  const profile = this.clientProfileRepository.create({
    user: user,
    phoneNumber: clientData.phoneNumber ?? undefined,
    country: clientData.country ?? undefined,
  });

  return this.clientProfileRepository.save(profile);
}

async updateClientProfile(clientId: number, updateDto: UpdateClientProfileDto) {
  
    const profile = await this.clientProfileRepository
  .createQueryBuilder('profile')
  .leftJoinAndSelect('profile.user', 'user')
  .where('user.id = :clientId', { clientId })
  .getOne();

    if (!profile) {
      throw new NotFoundException('Client profile not found');
    }

    // Update user data
    if (updateDto.username || updateDto.email || updateDto.imageUrl) {
      profile.user.username = updateDto.username ?? profile.user.username;
      profile.user.email = updateDto.email ?? profile.user.email;
      profile.user.imageUrl = updateDto.imageUrl ?? profile.user.imageUrl;
      await this.userRepo.save(profile.user);
    }

    // Update profile data
    profile.bio = updateDto.bio ?? profile.bio;
    profile.companyName = updateDto.companyName ?? profile.companyName;
    profile.country = updateDto.country ?? profile.country;
    profile.industry = updateDto.industry ?? profile.industry;
    profile.phoneNumber = updateDto.phoneNumber ?? profile.phoneNumber;
    profile.linkedIn = updateDto.linkedIn ?? profile.linkedIn;
    return await this.clientProfileRepository.save(profile);
  }

  async getClientStats(userId: number) {
  const clientProfile = await this.clientProfileRepository
    .createQueryBuilder('profile')
    .leftJoinAndSelect('profile.user', 'user')
    .where('user.id = :userId', { userId })
    .getOne();

  if (!clientProfile) {
    throw new NotFoundException('Client profile not found');
  }

  const totalMissions = await this.missionRepo.count({
    where: { client: { id: clientProfile.id } },
  });

  const missionsInProgress = await this.missionRepo.count({
    where: {
      client: { id: clientProfile.id },
      status: 'in_progress',
    },
  });

  const hiredFreelancers = await this.missionRepo
    .createQueryBuilder('mission')
    .select('COUNT(DISTINCT mission.selectedFreelancer)')
    .where('mission.clientId = :clientId', { clientId: clientProfile.id })
    .andWhere('mission.selectedFreelancer IS NOT NULL')
    .getRawOne();

  const avgRating = await this.reviewRepo
  .createQueryBuilder('review')
  .select('AVG(review.stars)', 'average')
  .innerJoin('review.mission', 'mission')
  .innerJoin('mission.client', 'client')
  .innerJoin('client.user', 'clientUser')
  .where('clientUser.id = :userId', { userId })
  .andWhere('review.reviewedUser = :userId', { userId })
  .getRawOne();


  return {
    averageRating: parseFloat(avgRating.average) || 0,
    totalMissions,
    missionsInProgress,
    hiredFreelancers: parseInt(hiredFreelancers.count) || 0,
  };
}
async getAllClients(): Promise<ClientProfile[]> {
    return this.clientProfileRepository.find({
      relations: ['user'], 
    });
  }

}
