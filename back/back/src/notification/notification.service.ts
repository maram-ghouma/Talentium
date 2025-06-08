import { Injectable, forwardRef, Inject } from '@nestjs/common'; // Add forwardRef, Inject
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(data: { userId: number; content: string; type: string }): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId: data.userId,
      content: data.content,
      type: data.type,
      isRead: false,
      timestamp: new Date(),
    });

    return await this.notificationRepository.save(notification);
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId, isRead: false },
      order: { timestamp: 'DESC' },
    });
  }

  async markNotificationAsRead(id: number, userId: number): Promise<void> {
    const notification = await this.notificationRepository.findOne({ where: { id, userId } });
    if (!notification) {
      throw new Error('Notification not found or not authorized');
    }

    notification.isRead = true;
    await this.notificationRepository.save(notification);
  }
}