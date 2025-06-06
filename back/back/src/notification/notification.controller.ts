// src/notification/notification.controller.ts
import { Controller, Get, Post, UseGuards, Req, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async getUnreadNotifications(@Req() request: any) {
    return this.notificationService.getUnreadNotifications(request.user.userId);
  }

  @Post(':id/read')
  async markNotificationAsRead(@Req() request: any, @Param('id') id: number) {
    await this.notificationService.markNotificationAsRead(id, request.user.userId);
    return { success: true };
  }
}