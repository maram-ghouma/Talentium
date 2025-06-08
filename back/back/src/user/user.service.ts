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
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['badges'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    if (user.badges.length === 0) {
      throw new NotFoundException(`No badges found for user with ID ${userId}`);
    }

    return user.badges;

  }


  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }
  async findById(userId: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: userId } });
  }

}
