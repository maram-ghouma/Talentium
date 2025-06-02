import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../conversation/entities/conversation.entity';
import { Message } from '../conversation/entities/message.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,

    @InjectRepository(Message)
    private messageRepo: Repository<Message>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async saveMessage({
    conversationId,
    senderId,
    content,
  }: {
    conversationId: number;
    senderId: number;
    content: string;
  }): Promise<Message> {
    const [conversation, sender] = await Promise.all([
      this.conversationRepo.findOne({
        where: { id: conversationId },
        relations: ['participants'],
      }),
      this.userRepo.findOne({ where: { id: senderId } }),
    ]);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    if (!conversation.participants.some((p) => p.id === sender.id)) {
      throw new NotFoundException('Sender is not a participant in this conversation');
    }

    const message = this.messageRepo.create({
      content,
      timestamp: new Date(),
      isRead: false,
      sender,
      conversation,
    });

    return this.messageRepo.save(message);
  }

  async markMessagesAsRead(conversationId: number, userId: number): Promise<void> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
      relations: ['participants'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!conversation.participants.some((p) => p.id === userId)) {
      throw new NotFoundException('User is not a participant in this conversation');
    }

    try {
      await this.messageRepo
        .createQueryBuilder()
        .update(Message)
        .set({ isRead: true })
        .where(
          'conversationId = :conversationId AND senderId != :userId AND isRead = :isRead',
          {
            conversationId,
            userId,
            isRead: false,
          }
        )
        .execute();
      console.log(`Messages marked as read for conversation ${conversationId}`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  async getConversations(userId: number): Promise<Conversation[]> {
    const conversations = await this.conversationRepo
        .createQueryBuilder('conversation')
        .leftJoinAndSelect('conversation.participants', 'participants')
        .leftJoinAndSelect('conversation.mission', 'mission')
        .leftJoinAndSelect('conversation.messages', 'messages')
        .where('participants.id = :userId', { userId })
        .getMany();

    return conversations;
    }
}
