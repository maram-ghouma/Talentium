import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ namespace: '/notifications', cors: { origin: 'http://localhost:4200', credentials: true } })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly notificationService: NotificationService, // <-- This is argument index [0]
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;

    if (!token) {
      console.log('[NotificationGateway] No token provided, disconnecting:', client.id);
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
        console.log('[NotificationGateway] User not found, disconnecting:', client.id);
        client.emit('error', { message: 'User not found' });
        client.disconnect();
        return;
      }

      client.data.userId = user.id;
      client.join(`user-${user.id}`);
      console.log('[NotificationGateway] Client connected:', client.id, `user-${user.id}`);
    } catch (err) {
      console.log('[NotificationGateway] Authentication failed, disconnecting:', client.id, err.message);
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  @SubscribeMessage('getNotifications')
  async handleGetNotifications(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (!userId) {
      console.log('[NotificationGateway] No userId, unauthorized');
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    const notifications = await this.notificationService.getUnreadNotifications(userId);
    for (const notification of notifications) {
      this.emitNotification(notification);
    }
    //client.emit('notifications', notifications);
  }

  async emitNotification(notification: Notification) {
    this.server.to(`user-${notification.userId}`).emit('notification', {
      id: notification.id,
      type: notification.type,
      content: notification.content,
      userId: notification.userId,
      isRead: notification.isRead,
      timestamp: notification.timestamp,
    });
    console.log('[NotificationGateway] Emitted notification to user:', notification.userId);
  }
}