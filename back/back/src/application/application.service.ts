
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Application, ApplicationStatus } from './entities/application.entity';
import { CreateApplicationInput } from './dto/create-application.input';
import { UpdateApplicationInput } from './dto/update-application.input';
import { User } from 'src/user/entities/user.entity';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { FileUpload } from 'graphql-upload-ts';
import { Mission } from 'src/mission/entities/mission.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
        @InjectRepository(FreelancerProfile)
    private freelancerProfileRepository: Repository<FreelancerProfile>,
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
  ) {}

  async create(createApplicationInput: CreateApplicationInput,  user:any): Promise<Application> {
      const fullUser = await this.userRepository.findOne({ where: { id: user.userId } });

  if (!fullUser) {
    throw new Error('User not found');
  }
  const freelancer = await this.freelancerProfileRepository.findOne({
    where: { user: fullUser },
  });
    if (!freelancer) {
    throw new NotFoundException('Freelancer profile not found');
  }
    const existingApplication = await this.applicationRepository.findOne({
      where: {
        missionId: createApplicationInput.missionId,
        freelancerId: freelancer.id.toString()
      }
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied to this mission');
    }
    const application = this.applicationRepository.create({
      ...createApplicationInput,
      freelancerId: freelancer.id.toString(),
      status: ApplicationStatus.PENDING
    });

    return await this.applicationRepository.save(application);
  }

  async findAll(): Promise<Application[]> {
    return await this.applicationRepository.find({
      relations: ['mission', 'freelancer']
    });
  }

  async findByMission(missionId: string): Promise<Application[]> {
    return await this.applicationRepository.find({
      where: { missionId },
      relations: ['freelancer','freelancer.user'],
      order: { createdAt: 'DESC' }
    });
  }
async findMineByMission(missionId: string, user: any): Promise<Application[]> {
  return this.applicationRepository
    .createQueryBuilder('application')
    .leftJoinAndSelect('application.mission', 'mission')
    .leftJoinAndSelect('application.freelancer', 'freelancer')
    .leftJoinAndSelect('freelancer.user', 'freelancerUser')
    .where('mission.id = :missionId', { missionId })
    .andWhere('freelancerUser.id = :userId', { userId: user.userId })
    .getMany();
}


  async findByFreelancer(freelancerId: string): Promise<Application[]> {
    return await this.applicationRepository.find({
      where: { freelancerId },
      relations: ['mission'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['mission', 'freelancer']
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async update(id: string, updateApplicationInput: UpdateApplicationInput): Promise<Application> {
    const application = await this.findOne(id);
    
    Object.assign(application, updateApplicationInput);
    
    return await this.applicationRepository.save(application);
  }

  async remove(id: string): Promise<boolean> {
    const application = await this.findOne(id);
    
    if (application.resumePath && fs.existsSync(application.resumePath)) {
      fs.unlinkSync(application.resumePath);
    }

    await this.applicationRepository.remove(application);
    return true;
  }

 async saveResumeFile(file: Express.Multer.File, freelancerId: string, applicationId: string): Promise<string> {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'resumes');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `${freelancerId}_${timestamp}_${file.originalname}`;
    const filepath = path.join(uploadsDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    await this.applicationRepository.update(applicationId, { resumePath: filepath });

    return filepath;
  }

  async getResumeFile(applicationId: string): Promise<{ filepath: string; filename: string }> {
    const application = await this.findOne(applicationId);
    
    if (!fs.existsSync(application.resumePath)) {
      throw new NotFoundException('Resume file not found');
    }

    return {
      filepath: application.resumePath,
      filename: path.basename(application.resumePath)
    };
  }

  async updateApplicationStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
  ): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['mission', 'freelancer'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const mission = await this.missionRepository.findOne({
      where: { id: application.mission.id },
      relations: ['preselectedFreelancers', 'selectedFreelancer', 'applications'],
    });

    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    application.status = newStatus;

    if (newStatus === ApplicationStatus.PRE_SELECTED) {
      const alreadyPreselected = mission.preselectedFreelancers.some(
        f => f.id === application.freelancer.id,
      );
      if (!alreadyPreselected) {
        mission.preselectedFreelancers.push(application.freelancer);
      }
      await this.missionRepository.save(mission);
     

    } else if (newStatus === ApplicationStatus.ACCEPTED) {
      mission.selectedFreelancer = application.freelancer;

      mission.preselectedFreelancers = mission.preselectedFreelancers.filter(
        f => f.id === application.freelancer.id,
      );
       const applications = mission.applications ?? [];
      for (const app of applications) {
        if (app.id !== application.id && app.status === ApplicationStatus.PRE_SELECTED) {
          app.status = ApplicationStatus.REJECTED;
          await this.applicationRepository.save(app);
              await this.missionRepository
              .createQueryBuilder()
              .relation(Mission, "preselectedFreelancers")
              .of(app.missionId)
              .remove(app.freelancerId); 
        }
      }
      mission.status='in_progress';
      await this.missionRepository.save(mission);
    }
 

    await this.applicationRepository.save(application);

    return application;
  }

  async getFreelancersByClient(userId: string): Promise<FreelancerProfile[]> {
  const missions = await this.missionRepository.find({
    where: { client: { user: { id: +userId } } },
    relations: ['client', 'client.user'],
  });

  if (!missions.length) return [];

  const missionIds = missions.map(m => m.id);

  const applications = await this.applicationRepository.find({
    where: { mission: { id: In(missionIds) } },
    relations: ['freelancer', 'freelancer.user'], 
  });

  const freelancers = applications.map(app => app.freelancer);

  const uniqueFreelancers = Array.from(new Map(freelancers.map(f => [f.id, f])).values());

  return uniqueFreelancers;
}

}