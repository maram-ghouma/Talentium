import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
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

    // Validate missionId
    if (isNaN(missionId)) {
      console.error('Invalid mission ID:', missionId);
      throw new Error('Invalid mission ID');
    }

    // Check for existing conversation
    const existing = await this.conversationRepository.findOne({
      where: { mission: { id: missionId } }, // Use number directly
      relations: ['participants', 'mission'],
    });
    if (existing && existing.participants.every(p => participantIds.includes(Number(p.id)))) {
      console.log('Existing conversation found:', existing);
      return existing;
    }

    // Find mission
    const mission = await this.missionRepository.findOne({
      where: { id: missionId }, // Use number directly
    });
    if (!mission) {
      console.error('Mission not found for ID:', missionId);
      throw new Error('Mission not found');
    }

    // Validate participant IDs
    if (participantIds.some(id => isNaN(id))) {
      console.error('Invalid participant IDs:', participantIds);
      throw new Error('Invalid participant ID');
    }

    // Find participants
    const participants = await this.userRepository.find({
      where: { id: In(participantIds) },
    });
    if (participants.length !== participantIds.length) {
      console.error('Participants found:', participants, 'Expected IDs:', participantIds);
      throw new Error('Some participants not found');
    }

    // Create conversation
    const conversation = this.conversationRepository.create({
      mission,
      participants,
      isActive: true,
    });

    // Save conversation
    try {
      const savedConversation = await this.conversationRepository.save(conversation);
      console.log('Saved conversation:', savedConversation);
      return savedConversation;
    } catch (error) {
      console.error('Failed to save conversation:', error.message);
      throw new Error('Could not save conversation: ' + error.message);
    }
  }

  findAll() {
    return `This action returns all conversation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  /*update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }*/

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}