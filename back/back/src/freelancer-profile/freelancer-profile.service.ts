import { Injectable } from '@nestjs/common';
import { CreateFreelancerProfileDto } from './dto/create-freelancer-profile.dto';
import { UpdateFreelancerProfileDto } from './dto/update-freelancer-profile.dto';

@Injectable()
export class FreelancerProfileService {
  create(createFreelancerProfileDto: CreateFreelancerProfileDto) {
    return 'This action adds a new freelancerProfile';
  }

  findAll() {
    return `This action returns all freelancerProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} freelancerProfile`;
  }

  update(id: number, updateFreelancerProfileDto: UpdateFreelancerProfileDto) {
    return `This action updates a #${id} freelancerProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} freelancerProfile`;
  }
}
