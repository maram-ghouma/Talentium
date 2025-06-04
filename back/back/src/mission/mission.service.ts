import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mission } from './entities/mission.entity';
import { CreateMissionInput } from './dto/create-mission.input';
import { UpdateMissionInput } from './dto/update-mission.input';
import { User } from 'src/user/entities/user.entity';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ClientProfile)
    private clientProfileRepository: Repository<ClientProfile>
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
    .leftJoinAndSelect('client.user', 'user')
    .where(`user.id = :usersId`, { usersId: user.userId })
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

}
