import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from './entities/interview.entity';
import { CreateInterviewInput } from './dto/create-interview.input';
import { UpdateInterviewInput } from './dto/update-interview.input';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,

    @InjectRepository(FreelancerProfile)
    private freelancerRepo: Repository<FreelancerProfile>,

    @InjectRepository(ClientProfile)
    private clientRepo: Repository<ClientProfile>,

    @InjectRepository(User)
        private userRepository: Repository<User>,
  ) {}

  async create(input: CreateInterviewInput,user:any): Promise<Interview> {
    const freelancer = await this.freelancerRepo.findOneByOrFail({ id: input.freelancerId });
    const fullUser = await this.userRepository.findOne({ where: { id: user.userId } });

    if (!fullUser) {
      throw new Error('User not found');
    }
    const client = await this.clientRepo.findOne({
      where: { user: fullUser },
    });
    if (!client) {
      throw new Error('Client not found');
    }

    const interview = this.interviewRepository.create({
      ...input,
      scheduledDateTime: new Date(input.scheduledDateTime),
      remindMeC:input.remindMe ,
      freelancer,
      client,
    });


    return this.interviewRepository.save(interview);
  }

  async findAll(type:String,user:any): Promise<Interview[]> {
    const fullUser = await this.userRepository.findOne({ where: { id: user.userId } });
    if (!fullUser) {
      throw new Error('User not found');
    }
    if(type=="client"){
      const client = await this.clientRepo.findOne({
        where: { user: fullUser },
      });
      if (!client) {
        throw new Error('Client not found');
      }
      return this.interviewRepository.find({
        where: { client},
        relations:['freelancer','freelancer.user','client','client.user']
      });
    }
    else{
      const freelancer = await this.freelancerRepo.findOne({
        where: { user: fullUser },
      });
      if (!freelancer) {
        throw new Error('Client not found');
      }
      return this.interviewRepository.find({
        where: { freelancer},
        relations:['freelancer','freelancer.user','client','client.user']
      }
      );
    }
  }
async switchRemindMe(interviewId: String, user: any): Promise<Interview> {
  const fullUser = await this.userRepository.findOne({ where: { id: user.userId } });
  if (!fullUser) {
    throw new Error('User not found');
  }

  const interview = await this.interviewRepository.findOne({
    where: { id: interviewId.toString() },
    relations: ['client', 'client.user', 'freelancer', 'freelancer.user'],
  });

  if (!interview) {
    throw new Error('Interview not found');
  }
  const isClient = interview.client?.user?.id === fullUser.id;
  const isFreelancer = interview.freelancer?.user?.id === fullUser.id;

  if (!isClient && !isFreelancer) {
    throw new Error('User is not authorized to update this interview');
  }

  if (isClient) {
    interview.remindMeC = !interview.remindMeC;
  } else if (isFreelancer) {
    interview.remindMeF = !interview.remindMeF;
  }

  return this.interviewRepository.save(interview);
}


  findOne(id: string): Promise<Interview> {
    return this.interviewRepository.findOneByOrFail({ id });
  }

  async update(input: UpdateInterviewInput): Promise<Interview> {
    const interview = await this.interviewRepository.findOneByOrFail({ id: input.id.toString() });
    Object.assign(interview, input);
    return this.interviewRepository.save(interview);
  }

  async remove(id: string): Promise<boolean> {
    await this.interviewRepository.delete(id);
    return true;
  }

  findByFreelancer(freelancerId: number): Promise<Interview[]> {
    return this.interviewRepository.find({
      where: { freelancer: { id: freelancerId } },
    });
  }

  findByClient(clientId: number): Promise<Interview[]> {
    return this.interviewRepository.find({
      where: { client: { id: clientId } },
    });
  }
}
