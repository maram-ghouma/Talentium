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

  async create(createMissionInput: CreateMissionInput,user:User): Promise<Mission> {
    const { /*clientId,*/ ...rest } = createMissionInput;

    const client = await this.clientProfileRepository.findOne({
      where: { user },
    });

    if (!client) throw new Error('Client not found');

    const mission = this.missionRepository.create({ ...rest, client });
    return this.missionRepository.save(mission);
  }

  findAll(user:User): Promise<Mission[]> {
    return this.missionRepository
  .createQueryBuilder('mission')
  .leftJoinAndSelect('mission.client', 'client')
  .leftJoinAndSelect('client.user', 'user')
  .where('user.id = :userId', { userId: user.id })
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
