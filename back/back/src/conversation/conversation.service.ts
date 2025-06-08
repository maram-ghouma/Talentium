import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { User } from 'src/user/entities/user.entity';
import { Mission } from 'src/mission/entities/mission.entity';


@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
  ) {}
  async create(createConversationDto: CreateConversationDto): Promise<Conversation> {
    const { missionId, participantIds } = createConversationDto;

    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
    });

    if (!mission) {
      throw new Error('Mission not found');
    }

    const participants = await this.userRepository.findByIds(participantIds);

    if (participants.length !== participantIds.length) {
      throw new Error('Some participants not found');
    }

    const conversation = this.conversationRepository.create({
      mission,
      participants,
      isActive: true,
    });

    return await this.conversationRepository.save(conversation);
  }

  findAll() {
    return `This action returns all conversation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
