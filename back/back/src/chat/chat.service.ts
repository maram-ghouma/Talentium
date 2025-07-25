import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../conversation/entities/conversation.entity';
import { Message } from '../conversation/entities/message.entity';
import { User } from 'src/user/entities/user.entity';

export interface ConversationDTO {
  id: number;
  isActive: boolean;
  messages: {
    id: number;
    content: string;
    timestamp: Date;
    isRead: boolean;
    senderId: number;
    file?: {
      fileName: string;
      originalName: string;
      path: string;
    };
  }[];
  participants: {
    id: number;
    name: string;
    imageUrl: string;
  }[];
}

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
    console.log(`Attempting to save message in conversation ${conversationId} from user ${senderId}:`, { conversation, sender });

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
    console.log(`Saving message from user ${senderId} in conversation ${conversationId}:`, message);

    return this.messageRepo.save(message);
  }

  async saveFileMessage({
    conversationId,
    senderId,
    fileName,
    originalName,
    filePath,
  }: {
    conversationId: number;
    senderId: number;
    fileName: string;
    originalName: string;
    filePath: string;
  }): Promise<Message> {
    const [conversation, sender] = await Promise.all([
      this.conversationRepo.findOne({
        where: { id: conversationId },
        relations: ['participants'],
      }),
      this.userRepo.findOne({ where: { id: senderId } }),
    ]);
    console.log(`Attempting to save file message in conversation ${conversationId} from user ${senderId}:`, {
      conversation,
      sender,
      fileName,
      originalName,
      filePath,
    });

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
      content: `File: ${originalName}`, // Placeholder content for file message
      timestamp: new Date(),
      isRead: false,
      sender,
      conversation,
      fileName,
      originalName,
      filePath,
    });
    console.log(`Saving file message from user ${senderId} in conversation ${conversationId}:`, message);

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

  async getConversations(userId: number): Promise<ConversationDTO[]> {
    // Step 1: Find conversation IDs for the user
    const conversationIds = await this.conversationRepo
      .createQueryBuilder('conversation')
      .leftJoin('conversation.participants', 'participants')
      .where('participants.id = :userId', { userId })
      .select('conversation.id')
      .getRawMany()
      .then(results => results.map(result => result.conversation_id));

    //console.log(`[ConversationService] Found conversation IDs for user ${userId}:`, conversationIds);

    if (!conversationIds.length) {
      return [];
    }

    // Step 2: Fetch full conversations with all relations
    const conversations = await this.conversationRepo
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participants')
      .leftJoinAndSelect('conversation.mission', 'mission')
      .leftJoinAndSelect('conversation.messages', 'messages')
      .leftJoinAndSelect('messages.sender', 'sender')
      .where('conversation.id IN (:...conversationIds)', { conversationIds })
      .orderBy('messages.timestamp', 'DESC')
      .getMany();

    return conversations.map((conversation) => ({
      id: conversation.id || 0,
      isActive: conversation.isActive ?? true,
      messages: (conversation.messages || []).map((msg) => ({
        id: msg.id || 0,
        content: msg.content || '',
        timestamp: msg.timestamp || new Date(),
        isRead: msg.isRead ?? false,
        senderId: msg.sender?.id || 0,
        file: msg.fileName
          ? {
              fileName: msg.fileName,
              originalName: msg.originalName || '',
              path: msg.filePath || '',
            }
          : undefined,
      })),
      participants: (conversation.participants || []).filter(user => user).map((user) => ({
        id: user.id || 0,
        name: user.username || 'Unknown',
        imageUrl: user.imageUrl || '',
      })),
    }));
  }
}