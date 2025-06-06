import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';

@WebSocketGateway({ namespace: '/notifications', cors: { origin: '*' } })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(private notificationService: NotificationService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.join(`user-${userId}`);
      console.log('[NotificationGateway] Client connected:', client.id, `user-${userId}`);
    } else {
      console.log('[NotificationGateway] No userId provided, disconnecting:', client.id);
      client.disconnect();
    }
  }

  @SubscribeMessage('getNotifications')
  async handleGetNotifications(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) return;

    const notifications = await this.notificationService.getUnreadNotifications(parseInt(userId));
    client.emit('notifications', notifications);
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