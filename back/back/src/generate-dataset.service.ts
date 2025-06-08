import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Mission } from "./mission/entities/mission.entity";
import { FreelancerProfile } from "./freelancer-profile/entities/freelancer-profile.entity";
import { IsNull, Not, Repository } from "typeorm";
import * as fs from 'fs';



@Injectable()
export class DatasetService {
  constructor(
    @InjectRepository(Mission) private missionRepo: Repository<Mission>,
    @InjectRepository(FreelancerProfile) private freelancerRepo: Repository<FreelancerProfile>,
  ) {}

  async generateTrainingData() {
    const dataset: Array<{
  mission_id: number;
  freelancer_id: number;
  skill_match_score: number;
  has_worked_with_client_before: boolean;
  times_worked_with_client: number;
  was_preselected: boolean;
  price: number;
  industry: string;
  label: number;
}> = [];

    const missions = await this.missionRepo.find({
      where: { selectedFreelancer: Not(IsNull()) },
      relations: ['client', 'selectedFreelancer', 'preselectedFreelancers', 'applications'],
    });

    for (const mission of missions) {
      const selectedFreelancer = mission.selectedFreelancer;
      const allFreelancers = await this.freelancerRepo.find({ relations: ['user'] });
      if(!selectedFreelancer){
        throw new Error('User not found');
      }

      const selectedFeatures = await this.extractFeatures(mission, selectedFreelancer);
      dataset.push({ ...selectedFeatures, label: 1 });

      const negativeCandidates = allFreelancers
        .filter(f => f.id !== selectedFreelancer.id && !mission.preselectedFreelancers.some(p => p.id === f.id))
        .slice(0, 3); 

      for (const negativeFreelancer of negativeCandidates) {
        const negFeatures = await this.extractFeatures(mission, negativeFreelancer);
        dataset.push({ ...negFeatures, label: 0 });
      }
    }

    // Save to file (optional)
    const csv = this.toCSV(dataset);
    fs.writeFileSync('training_dataset.csv', csv);
  }

  async extractFeatures(mission: Mission, freelancer: FreelancerProfile) {
    const skillMatchScore = this.computeSkillMatch(mission.requiredSkills, freelancer.skills);
    
    const pastMissions = await this.missionRepo.find({
      where: {
        selectedFreelancer: { id: freelancer.id },
        client: { id: mission.client.id },
      },
    });

    const hasWorkedBefore = pastMissions.length > 0;
    const timesWorkedWithClient = pastMissions.length;
    const wasPreselected = mission.preselectedFreelancers?.some(p => p.id === freelancer.id) || false;

    return {
      mission_id: mission.id,
      freelancer_id: freelancer.id,
      skill_match_score: skillMatchScore,
      has_worked_with_client_before: hasWorkedBefore,
      times_worked_with_client: timesWorkedWithClient,
      was_preselected: wasPreselected,
      price: mission.price,
      industry: mission.client.industry,
    };
  }

  computeSkillMatch(required: string[], has: string[]) {
    const intersection = required.filter(skill => has.includes(skill));
    return intersection.length / required.length; // Normalize
  }

  toCSV(rows: any[]) {
    const header = Object.keys(rows[0]).join(',');
    const body = rows.map(row => Object.values(row).join(',')).join('\n');
    return `${header}\n${body}`;
  }
}
