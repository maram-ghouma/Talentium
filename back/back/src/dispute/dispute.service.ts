import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dispute, DisputeStatus } from './entities/dispute.entity';
import { In, Not, Repository } from 'typeorm';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { Mission } from 'src/mission/entities/mission.entity';

import { NotificationService } from '../notification/notification.service';
import { User, UserRole } from 'src/user/entities/user.entity'; // Import User and UserRole



@Injectable()
export class DisputeService {
   constructor(
    @InjectRepository(Dispute)
    private disputeRepository: Repository<Dispute>,
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ClientProfile) 
    private clientProfileRepository: Repository<ClientProfile>,
    @InjectRepository(FreelancerProfile)
    private freelancerProfileRepository: Repository<FreelancerProfile>,
    private notificationService: NotificationService,
  ) {}
  
  

  async getDisputeStats() {
    const total = await this.disputeRepository.count();
    const inReview = await this.disputeRepository.count({
      where: { status: DisputeStatus.OPEN },
    });
    const resolved = await this.disputeRepository.count({
      where: { status: DisputeStatus.RESOLVED },
    });

    return {
      total,
      inReview,
      resolved,
    };
  }
  async getOpenDisputesWithProfiles() {
  const disputes = await this.disputeRepository.find({
    where: {
      status: Not(In([DisputeStatus.RESOLVED, DisputeStatus.REJECTED])),
    },
    relations: [
      'openedBy',
      'mission',
      'mission.client',
      'mission.client.user',         
      'mission.selectedFreelancer',
      'mission.selectedFreelancer.user'  
    ],
  });
  return disputes;
}

  async resolveDispute(disputeId: number, resolution: string): Promise<{ message: string }> {
    // Fetch the dispute, making sure to load the 'openedBy' and 'mission' relations
    const dispute = await this.disputeRepository.findOne({
      where: { id: disputeId },
      relations: ['openedBy', 'mission'], // Load the user who opened it and the related mission
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    // Only proceed if the dispute is currently open (or in review), not already resolved/rejected
    if (dispute.status === DisputeStatus.RESOLVED || dispute.status === DisputeStatus.REJECTED) {
      return { message: 'Dispute is already resolved or rejected.' };
    }

    dispute.status = DisputeStatus.RESOLVED;
    dispute.resolution = resolution;

    await this.disputeRepository.save(dispute);

    // --- Send notification to the user who opened the dispute ---
    try {
      const openedByUser = dispute.openedBy;
      const missionTitle = dispute.mission?.title || 'a mission'; // Get mission title for context

      if (openedByUser) {
        await this.notificationService.createNotification({
          userId: openedByUser.id,
          content: `Your dispute for mission "${missionTitle}" has been resolved! Resolution: "${resolution}".`,
          type: 'dispute_resolved', // Specific type for resolved disputes
        });
      }
    } catch (notificationError) {
      console.error('Failed to send dispute resolution notification:', notificationError.message);
    }
    // --- End notification logic ---

    return { message: 'Dispute resolved successfully' };
  }
  async getResolvedDisputesWithProfiles() {
  const disputes = await this.disputeRepository.find({
    where: {
      status: In([DisputeStatus.RESOLVED]),
    },
    relations: [
      'openedBy',
      'mission',
      'mission.client',
      'mission.client.user',         
      'mission.selectedFreelancer',
      'mission.selectedFreelancer.user'  
    ],
  });
  return disputes;
}
async createDisputeFreelancer(createDisputeDto: CreateDisputeDto, userId: number): Promise<Dispute> {
  const { missionId, reason } = createDisputeDto;

  const mission = await this.missionRepository.findOne({
    where: { id: missionId },
    relations: ['disputes'],
  });

  if (!mission) {
    throw new NotFoundException('Mission not found');
  }
const user = await this.userRepository.findOne({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const dispute = this.disputeRepository.create({
    reason,
    status: DisputeStatus.OPEN,
    openedAt: new Date(),
    openedBy: user,
    mission: mission, // ✅ Link the mission
  });

  return this.disputeRepository.save(dispute);
}


}
