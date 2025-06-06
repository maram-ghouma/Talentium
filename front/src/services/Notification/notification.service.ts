import { EventEmitter } from 'events';
import {Socket, io} from 'socket.io-client';
import api from '../axiosConfig';

export interface Notification {
  id: number;
  type: string;
  content: string;
  userId: number;
  isRead: boolean;
  timestamp: Date;
}

export class NotificationService {
  private socket: Socket;
  private notificationsEmitter = new EventEmitter();
  private notifications: Notification[] = [];

  constructor(userId: number) {
    this.socket = io('http://localhost:3000/notifications', {
      query: { userId: userId.toString() },
    });
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('[NotificationService] Connected to notifications socket');
      this.socket.emit('getNotifications');
    });

    this.socket.on('notification', (notification: Notification) => {
      console.log('[NotificationService] Received notification:', notification);
      this.notifications.push({ ...notification, timestamp: new Date(notification.timestamp) });
      this.notificationsEmitter.emit('update', [...this.notifications]);
    });

    this.socket.on('notifications', (notifications: Notification[]) => {
      console.log('[NotificationService] Received notifications:', notifications);
      this.notifications = notifications.map(n => ({
        ...n,
        timestamp: new Date(n.timestamp),
      }));
      this.notificationsEmitter.emit('update', [...this.notifications]);
    });
  }

  onNotificationsUpdate(callback: (notifications: Notification[]) => void) {
    this.notificationsEmitter.on('update', callback);
    return () => this.notificationsEmitter.off('update', callback);
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    const response = await api.get<Notification[]>('/notifications');
    this.notifications = response.data.map(n => ({
      ...n,
      timestamp: new Date(n.timestamp),
    }));
    this.notificationsEmitter.emit('update', [...this.notifications]);
    return response.data;
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    await api.post(`/notifications/${notificationId}/read`);
    this.notifications = this.notifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n,
    );
    this.notificationsEmitter.emit('update', [...this.notifications]);
  }

  disconnect() {
    this.socket.disconnect();
  }
}