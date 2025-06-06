// src/services/notification.service.ts
import { EventEmitter } from 'events';
import {Socket, io} from 'socket.io-client';
import api from '../axiosConfig';
import { NotificationProps } from '../../components/realtime_notification/notification';

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
  private notifications: NotificationProps[] = [];

  constructor(userId: number) {
    this.socket = io('http://localhost:3000/notifications', {
      query: { userId: userId.toString() },
    });
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('[NotificationService] Connected to notifications');
      this.socket.emit('getNotifications');
    });

    this.socket.on('notification', (notification: Notification) => {
      console.log('[NotificationService] Received notification:', notification);
      const mappedNotification: NotificationProps = {
        id: notification.id.toString(),
        title: notification.type,
        content: notification.content,
        type: 'default',
        onDismiss: this.handleDismiss.bind(this),
        autoHide: true,
        duration: 5000,
      };
      this.notifications.push(mappedNotification);
      this.notificationsEmitter.emit('update', [...this.notifications]);
    });

    this.socket.on('notifications', (notifications: Notification[]) => {
      console.log('[NotificationService] Received notifications:', notifications);
      this.notifications = notifications.map(n => ({
        id: n.id.toString(),
        title: n.type,
        content: n.content,
        type: 'default',
        onDismiss: this.handleDismiss.bind(this),
        autoHide: true,
        duration: 5000,
      }));
      this.notificationsEmitter.emit('update', [...this.notifications]);
    });
  }

  private handleDismiss(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notificationsEmitter.emit('update', [...this.notifications]);
    // Mark as read on server
    api.post(`/notifications/${id}/read`).catch(err => {
      console.error('[NotificationService] Error marking notification as read:', err);
    });
  }

  onNotificationsUpdate(callback: (notifications: NotificationProps[]) => void) {
    this.notificationsEmitter.on('update', callback);
    return () => this.notificationsEmitter.off('update', callback);
  }

  async getUnreadNotifications(): Promise<NotificationProps[]> {
    const response = await api.get<Notification[]>('/notifications');
    this.notifications = response.data.map(n => ({
      id: n.id.toString(),
      title: n.type,
      content: n.content,
      type: 'default',
      onDismiss: this.handleDismiss.bind(this),
      autoHide: true,
      duration: 5000,
    }));
    this.notificationsEmitter.emit('update', [...this.notifications]);
    console.log('[NotificationService] Fetched unread notifications:', this.notifications);
    return this.notifications;
  }

  disconnect() {
    this.socket.disconnect();
  }
}