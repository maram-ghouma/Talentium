import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mission } from 'src/mission/entities/mission.entity';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
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
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(FreelancerProfile)
    private freelancerProfileRepository: Repository<FreelancerProfile>,

    @InjectRepository(ClientProfile)
    private clientProfileRepository: Repository<ClientProfile>,

    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  // Create a new mission
  async createMaher(input: {
    title: string;
    description: string;
    status?: 'not_assigned' | 'in_progress' | 'completed';
    price: number;
    date: string;
    clientId?: number;
    requiredSkills: string[];
    deadline: Date;
    budget: string;
    clientName?: string;
    progress?: number;
    tasks?: { total: number; completed: number };
  }): Promise<Mission> {
    const mission = this.missionRepository.create({
      title: input.title,
      description: input.description,
      status: input.status || 'not_assigned',
      price: input.price,
      date: input.date,
      client: input.clientId ? { id: input.clientId } : undefined,
      requiredSkills: input.requiredSkills,
      deadline: input.deadline,
      budget: input.budget,
      clientName: input.clientName || 'john Client',
      progress: input.progress || 0,
      tasks: input.tasks || { total: 0, completed: 0 },
      createdAt: new Date(),
    });
    return this.missionRepository.save(mission);
  }

  // Find all missions
  async findAllMaher(): Promise<Mission[]> {
    return this.missionRepository.find({
      relations: ['client', 'preselectedFreelancers', 'selectedFreelancer', 'tasklist'],
    });
  }

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


  

  // Find one mission by ID
  async findOne(id: number): Promise<Mission> {
    const mission = await this.missionRepository.findOne({
      where: { id },
      relations: ['client', 'preselectedFreelancers', 'selectedFreelancer', 'tasklist'],
    });
    if (!mission) {
      throw new NotFoundException(`Mission with ID ${id} not found`);
    }
    return mission;
  }

  // Update a mission
  async update(id: number, input: {
    title?: string;
    description?: string;
    status?: 'not_assigned' | 'in_progress' | 'completed';
    price?: number;
    date?: string;
    clientId?: number;
    requiredSkills?: string[];
    deadline?: Date;
    budget?: string;
    clientName?: string;
    progress?: number;
    tasks?: { total: number; completed: number };
    preselectedFreelancers?: any[];
    selectedFreelancer?: any;
  }): Promise<Mission> {
    const mission = await this.findOne(id);
    Object.assign(mission, {
      title: input.title || mission.title,
      description: input.description || mission.description,
      status: input.status || mission.status,
      price: input.price || mission.price,
      date: input.date || mission.date,
      client: input.clientId ? { id: input.clientId } : mission.client,
      requiredSkills: input.requiredSkills || mission.requiredSkills,
      deadline: input.deadline || mission.deadline,
      budget: input.budget || mission.budget,
      clientName: input.clientName || mission.clientName,
      progress: input.progress || mission.progress,
      tasks: input.tasks || mission.tasks,
      preselectedFreelancers: input.preselectedFreelancers || mission.preselectedFreelancers,
      selectedFreelancer: input.selectedFreelancer || mission.selectedFreelancer,
    });
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





  // Get tasks for a mission (for Kanban board)
  async getMissionTasks(missionId: number, userId: number): Promise<Task[]> {
    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
      relations: ['tasklist', 'client', 'selectedFreelancer'],  
    });
    if (!mission) {
      throw new NotFoundException(`Mission with ID ${missionId} not found`);
    }
    if (mission.client?.id !== userId && mission.selectedFreelancer?.id !== userId) {
      throw new ForbiddenException('Only the client or selected freelancer can access this mission');
    }
    console.log(`Fetching tasks for mission ID ${missionId} for user ID ${userId}`);
    return mission.tasklist || [];
  }

  // Update a task's status
  async updateTaskStatus(taskId: number, status: string, userId: number): Promise<Task> {
    const validStatuses = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      throw new NotFoundException(`Invalid status: ${status}. Must be NOT_STARTED, IN_PROGRESS, or COMPLETED`);
    }
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['mission', 'mission.client', 'mission.selectedFreelancer'],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    if (task.mission.client?.id !== userId && task.mission.selectedFreelancer?.id !== userId) {
      throw new ForbiddenException('Only the client or selected freelancer can update this task');
    }
    task.status = status as TaskStatus;
    return this.taskRepository.save(task);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, missionId } = createTaskDto;

    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
    });

    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    const task = this.taskRepository.create({
      title,
      description,
      mission,
      status: TaskStatus.NOT_STARTED,
    });

    return this.taskRepository.save(task);
  }

  async deleteTask(taskId: string): Promise<void> {
    const result = await this.taskRepository.delete(taskId);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }
  }
}