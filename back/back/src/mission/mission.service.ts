import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mission } from './entities/mission.entity';
import { CreateMissionInput } from './dto/create-mission.input';
import { UpdateMissionInput } from './dto/update-mission.input';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createMissionInput: CreateMissionInput): Promise<Mission> {
    const { clientId, ...rest } = createMissionInput;

    const client = await this.userRepository.findOne({ where: { id: clientId } });
    if (!client) throw new Error('Client not found');

    const mission = this.missionRepository.create({ ...rest, client });
    return this.missionRepository.save(mission);
  }

  findAll(): Promise<Mission[]> {
    return this.missionRepository.find({ relations: ['client'] });
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
