// src/chat/chat.gateway.ts
import { WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationGateway } from 'src/notification/notification.gateway';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Conversation) private conversationRepo: Repository<Conversation>,
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {
    console.log('[ChatGateway][INIT] Gateway initialized');
  }

  async handleConnection(client: Socket) {
    console.log('[ChatGateway] Received auth:', client.handshake.auth);
    const token = client.handshake.auth.token;

    if (!token) {
      client.emit('error', { message: 'No token provided' });
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('SECRET_KEY'),
      });

      const user = await this.userRepo.findOne({ where: { id: payload.sub } });
      if (!user) {
        client.emit('error', { message: 'User not found' });
        client.disconnect();
        return;
      }

      client.data.userId = user.id;
      console.log('[ChatGateway][CONNECT] User connected:', user.id);
    } catch (err) {
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('[ChatGateway][DISCONNECT] User:', client.data?.userId || 'unknown', 'ID:', client.id);
  }

  @SubscribeMessage('testEvent')
  handleTestEvent(client: Socket, payload: any) {
    console.log('[ChatGateway][EVENT] testEvent:', JSON.stringify(payload));
    client.emit('testResponse', { status: 'ok', payload });
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@MessageBody() conversationId: number, @ConnectedSocket() client: Socket) {
    console.log('[ChatGateway][EVENT] joinRoom: User:', client.data.userId, 'Conversation:', conversationId);
    const userId = client.data.userId;
    if (!userId) {
      console.log('[ChatGateway][EVENT] joinRoom: Unauthorized');
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    const convo = await this.conversationRepo.findOne({
      where: { id: conversationId },
      relations: ['participants'],
    });

    if (!convo || !convo.participants.some((p) => p.id === userId)) {
      console.log('[ChatGateway][EVENT] joinRoom: Invalid conversation:', conversationId);
      client.emit('error', { message: 'Forbidden' });
      return;
    }

    client.join(`conversation-${conversationId}`);
    console.log('[ChatGateway][EVENT] joinRoom: User:', userId, 'Joined:', `conversation-${conversationId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() data: { conversationId: number; content: string }, @ConnectedSocket() client: Socket) {
    console.log('[ChatGateway][EVENT] sendMessage:', JSON.stringify({ ...data, senderId: client.data.userId }));
    const userId = client.data.userId;
    const { conversationId, content } = data;

    if (!userId || !conversationId || !content?.trim()) {
      console.error('[ChatGateway][EVENT] sendMessage: Invalid data');
      client.emit('error', { message: 'Invalid message data' });
      return;
    }

    try {
      const message = await this.chatService.saveMessage({
        conversationId,
        senderId: userId,
        content,
      });
      const newMessage = {
        id: message.id,
        conversation: { id: message.conversation.id },
        sender: { id: message.sender.id },
        content: message.content,
        timestamp: message.timestamp,
        isRead: message.isRead,
      };
      console.log('[ChatGateway][EVENT] Emitting newMessage to:', `conversation-${conversationId}`);
      this.server.to(`conversation-${conversationId}`).emit('newMessage', newMessage);

      const conversation = await this.conversationRepo.findOne({
        where: { id: conversationId },
        relations: ['participants'],
      });

      for (const participant of conversation!.participants) {
        if (participant.id !== userId) {
          const notification = await this.notificationService.createNotification({
            type: 'notification',
            content: 'notification',
            userId: participant.id,
          });
          await this.notificationGateway.emitNotification(notification);
        }
      }
    } catch (error) {
      console.error('[ChatGateway][EVENT] sendMessage error:', error.message);
      client.emit('error', { message: 'Failed to send message', error: error.message });
    }
  }

  @SubscribeMessage('fileUploaded')
  async handleFileUploaded(
    @MessageBody() data: { conversationId: number; senderId: number; file: { fileName: string; originalName: string; path: string } },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('[ChatGateway][EVENT] fileUploaded:', JSON.stringify({ ...data, senderId: client.data.userId }));
    const userId = client.data.userId;
    const { conversationId, file } = data;

    if (!userId || !conversationId || !file || !file.fileName || !file.originalName || !file.path) {
      console.error('[ChatGateway][EVENT] fileUploaded: Invalid data');
      client.emit('error', { message: 'Invalid file data' });
      return;
    }

    try {
      const message = await this.chatService.saveFileMessage({
        conversationId,
        senderId: userId,
        fileName: file.fileName,
        originalName: file.originalName,
        filePath: file.path,
      });

      const fileMessage = {
        conversationId: message.conversation.id,
        senderId: message.sender.id,
        file: {
          fileName: message.fileName,
          originalName: message.originalName,
          path: message.filePath,
        },
      };
      console.log('[ChatGateway][EVENT] Emitting fileUploaded to:', `conversation-${conversationId}`);
      this.server.to(`conversation-${conversationId}`).emit('fileUploaded', fileMessage);

      const conversation = await this.conversationRepo.findOne({
        where: { id: conversationId },
        relations: ['participants'],
      });

      for (const participant of conversation!.participants) {
        if (participant.id !== userId) {
          const notification = await this.notificationService.createNotification({
            type: 'notification',
            content: 'New file uploaded',
            userId: participant.id,
          });
          await this.notificationGateway.emitNotification(notification);
        }
      }
    } catch (error) {
      console.error('[ChatGateway][EVENT] fileUploaded error:', error.message);
      client.emit('error', { message: 'Failed to process file upload', error: error.message });
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(@MessageBody() data: { conversationId: number }, @ConnectedSocket() client: Socket) {
    console.log('[ChatGateway][EVENT] markAsRead: User:', client.data.userId, 'Conversation:', data.conversationId);
    const userId = client.data.userId;
    if (!userId || !data.conversationId) {
      console.error('[ChatGateway][EVENT] markAsRead: Invalid data');
      client.emit('error', { message: 'Invalid data' });
      return;
    }

    try {
      await this.chatService.markMessagesAsRead(data.conversationId, userId);
      console.log('[ChatGateway][EVENT] markAsRead: Updated for:', data.conversationId);
    } catch (error) {
      console.error('[ChatGateway][EVENT] markAsRead error:', error.message);
      client.emit('error', { message: 'Failed to mark messages as read', error: error.message });
    }
  }
}