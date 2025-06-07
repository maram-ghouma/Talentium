import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createNotification({
    type,
    content,
    userId,
  }: {
    type: string;
    content: string;
    userId: number;
  }): Promise<Notification> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const notification = this.notificationRepo.create({
      type,
      content,
      userId,
      isRead: false,
      timestamp: new Date(),
      user,
    });
    console.log('[NotificationService] Creating notification:', notification);
    return this.notificationRepo.save(notification);
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    console.log('[NotificationService] Fetching unread notifications for user:', userId);
    return this.notificationRepo.find({
      where: { userId, isRead: false },
      order: { timestamp: 'DESC' },
    });
    
  }

  async markNotificationAsRead(notificationId: number, userId: number): Promise<void> {
    await this.notificationRepo.update(
      { id: notificationId, userId },
      { isRead: true },
    );
    console.log('[NotificationService] Marked notification as read:', notificationId);
  }
}