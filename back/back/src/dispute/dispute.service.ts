import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dispute, DisputeStatus } from './entities/dispute.entity';
import { In, Not, Repository } from 'typeorm';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';

@Injectable()
export class DisputeService {
   constructor(
    @InjectRepository(Dispute)
    private disputeRepository: Repository<Dispute>,
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
    const dispute = await this.disputeRepository.findOne({ where: { id: disputeId } });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    dispute.status = DisputeStatus.RESOLVED;
    dispute.resolution = resolution;

    await this.disputeRepository.save(dispute);

    return { message: 'Dispute resolved successfully' };
  }


}
