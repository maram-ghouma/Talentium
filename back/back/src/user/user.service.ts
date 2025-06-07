// src/user/user.service.ts
import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { GenericService } from 'src/services/genericService';
import { SwitchRoleDto } from './dto/switch-role.sto';

@Injectable()
export class UserService extends GenericService  {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {
    super(userRepo);
  }
  async findBadgesByUserId(userId: number) {
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.badges', 'badge')
      .where('user.id = :userId', { userId })
      .select(['badge.id', 'badge.type', 'badge.description'])
      .getMany();
      
  }


  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }
  async findById(userId: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: userId } });
  }
  // user.service.ts
async switchUserRole(userId: number, switchDto: SwitchRoleDto): Promise<User> {
  const user = await this.userRepo.findOne({ where: { id: userId } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (user.currentRole === switchDto.newRole) {
    throw new BadRequestException(`User already has the role '${switchDto.newRole}'`);
  }

  user.currentRole = switchDto.newRole;
  return await this.userRepo.save(user);
}

}
