import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mission } from './entities/mission.entity';
import { CreateMissionInput } from './dto/create-mission.input';
import { UpdateMissionInput } from './dto/update-mission.input';
import { User } from 'src/user/entities/user.entity';
import {FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { Review } from 'src/review/entities/review.entity';


@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(FreelancerProfile)
    private freelancerProfileRepository: Repository<FreelancerProfile>,

    @InjectRepository(ClientProfile)
    private clientProfileRepository: Repository<ClientProfile>,

    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

async create(createMissionInput: CreateMissionInput, user: any): Promise<Mission> {
  const { ...rest } = createMissionInput;
  const fullUser = await this.userRepository.findOne({ where: { id: user.userId } });

  if (!fullUser) {
    throw new Error('User not found');
  }
  const client = await this.clientProfileRepository.findOne({
    where: { user: fullUser },
  });

  if (!client) {
    throw new Error('Client not found');
  }

  const mission = this.missionRepository.create({ ...rest, client });
  return this.missionRepository.save(mission);
}

findAll(user: any): Promise<Mission[]> {
return this.missionRepository
  .createQueryBuilder('mission')
  .leftJoinAndSelect('mission.client', 'client')
  .leftJoinAndSelect('client.user', 'clientUser')
  .leftJoinAndSelect('mission.selectedFreelancer', 'freelancer')
  .leftJoinAndSelect('freelancer.user', 'freelancerUser') 
  .leftJoinAndSelect('freelancer.selectedMissions', 'freelancerSelectedMissions')
  .where('clientUser.id = :usersId', { usersId: user.userId })
  .getMany();


}

findAllNotMine(user: any): Promise<Mission[]> {
  return this.missionRepository
    .createQueryBuilder('mission')
    .leftJoinAndSelect('mission.client', 'client')
    .leftJoinAndSelect('client.user', 'user')
    .where(`user.id != :usersId`, { usersId: user.userId })
    .getMany();
}


  

  findOne(id: number): Promise<Mission | null> {
    return this.missionRepository.findOne({ where: { id }, relations: ['client'] });
  }

  async update(id: number, updateMissionInput: UpdateMissionInput): Promise<Mission> {
    const mission = await this.missionRepository.findOneBy({ id });
    if (!mission) throw new Error('Mission not found');

    Object.assign(mission, updateMissionInput);
    return this.missionRepository.save(mission);
  }

async remove(id: number): Promise<boolean> {
  const result = await this.missionRepository.delete(id);
  return (result.affected ?? 0) > 0;
}
   async getClientMissions(userId: number): Promise<Mission[]> {
      const clientProfile = await this.clientProfileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('user.id = :clientId', { clientId: userId })
      .getOne();
      console.log(clientProfile);

      if (!clientProfile) {
        return []; 
      }
      return this.missionRepository.find({
        where: { client: { id: clientProfile.id } },
        relations: ['client'],
        take: 2,
      });
  }

 async getFreelancerMissions(userId: number): Promise<Mission[]> {

  const freelancerProfile = await this.freelancerProfileRepository
  .createQueryBuilder('profile')
  .leftJoinAndSelect('profile.user', 'user')
  .where('user.id = :freelancerId', { freelancerId: userId })
  .getOne();
  if (!freelancerProfile) {
    return []; 
  }

  return this.missionRepository.find({
    where: {
      selectedFreelancer: { id: freelancerProfile.id },
    },
    relations: ['client', 'selectedFreelancer'],
    take: 2,
  });
}
async getAdminStats() {
    const totalUsers = await this.userRepository.count();

    const selectedFreelancers = await this.missionRepository
      .createQueryBuilder('mission')
      .where('mission.selectedFreelancerId IS NOT NULL')
      .getCount();

    const completedMissions = await this.missionRepository.count({
      where: { status: 'completed' },
    });

    return {
      totalUsers,
      selectedFreelancers,
      completedMissions,
    };
  }
  async getFreelancerMissionsWithReviews(userId: number) {
  const freelancerProfile = await this.freelancerProfileRepository
  .createQueryBuilder('profile')
  .leftJoinAndSelect('profile.user', 'user')
  .where('user.id = :freelancerId', { freelancerId: userId })
  .getOne();
  if (!freelancerProfile) {
    return []; 
  }

  const missions = await this.missionRepository.find({
    where: {
      selectedFreelancer: { id: freelancerProfile.id },
    },
    relations: ['client'],
  });

  const result = await Promise.all(
    missions.map(async (mission) => {
      const review = await this.reviewRepository.findOne({
        where: {
          mission: { id: mission.id },
          reviewedUser: { id: userId },
        },
        relations: ['reviewer'],
      });

      return {
        ...mission,
        review: review || null,
      };
    })
  );

  return result;
}


async findAllWithAI(user: any): Promise<Mission[]> {
  const freelancerProfile = await this.freelancerProfileRepository.findOne({
    where: { user: { id: user.userId } },
    relations: ['user'],
  });

  if (!freelancerProfile) {
    throw new Error('Freelancer profile not found');
  }

  const missionss = await this.findAllNotMine(user);
  const missions = missionss.filter(mission => mission.status == 'not_assigned');


  const predictionData = await Promise.all(
    missions.map(async (mission) => {
      const fullMission = await this.missionRepository.findOne({
        where: { id: mission.id },
        relations: ['client', 'preselectedFreelancers', 'applications'],
      });

      if (!fullMission) {
        throw new Error('Mission not found');
      }

      const requiredSkillNames = fullMission.requiredSkills as string[];
      const freelancerSkillNames = freelancerProfile.skills as string[];

      const skillMatchScore = this.computeSkillMatch(requiredSkillNames, freelancerSkillNames);

      const pastMissions = await this.missionRepository.find({
        where: {
          selectedFreelancer: { id: freelancerProfile.id },
          client: { id: fullMission.client.id },
        },
      });

      const hasWorkedBefore = pastMissions.length > 0;
      const wasPreselected =
        fullMission.preselectedFreelancers?.some((p) => p.id === freelancerProfile.id) || false;

      return {
        skill_match_score: skillMatchScore,
        has_worked_with_client_before: hasWorkedBefore ? 1 : 0,
        was_preselected: wasPreselected ? 1 : 0,
        price: fullMission.price,
        industry: fullMission.client.industry || 'Other',
        times_worked_with_client: pastMissions.length,
      };
    })
  );

  try {
    console.log(JSON.stringify({ data: predictionData }));
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: predictionData }),
    });

    if (!response.ok) {
      throw new Error('Prediction request failed');
    }

    const predictions = await response.json();
    console.log(predictions);

    const missionsWithPredictions = missions.map((mission, index) => ({
      ...mission,
      selectionProbability: predictions[index].prob_1,
    }));
    return missionsWithPredictions.sort((a, b) => b.selectionProbability - a.selectionProbability);
  } catch (error) {
    console.error('AI prediction error:', error);
    return missions;
  }
}

private computeSkillMatch(required: string[] | null, has: string[] | null): number {
  if (!required || required.length === 0 || !has || has.length === 0) return 0;
  const intersection = required.filter((skill) => has.includes(skill));
  return intersection.length / required.length;
}





}
