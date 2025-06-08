import {
  Controller,
  Get,
  Post,
  Req,
  Param,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import * as jsonwebtoken from 'jsonwebtoken';
import { Request } from 'express';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async getUnreadNotifications(@Req() req: Request) {
    console.log('Authorization header:', req.headers['authorization']);
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid Authorization header');
      throw new BadRequestException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    let decoded: { sub?: number; userId?: number; email?: string; role?: string };

    try {
      decoded = jsonwebtoken.verify(token, 'temporary_secretkey') as typeof decoded;
      console.log('Decoded token:', decoded);
    } catch (err) {
      console.log('Actual token verification error:', err.message);
      throw new BadRequestException('Invalid token');
    }

    const userId = decoded.userId || decoded.sub;
    if (!userId) {
      console.log('User ID not found in token');
      throw new BadRequestException('User ID not found in token');
    }

    const notifications = await this.notificationService.getUnreadNotifications(userId);
    return notifications;
  }

  @Post(':id/read')
  async markNotificationAsRead(@Req() req: Request, @Param('id') id: string) {
    console.log('Authorization header:', req.headers['authorization']);
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid Authorization header');
      throw new BadRequestException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    let decoded: { sub?: number; userId?: number; email?: string; role?: string };

    try {
      decoded = jsonwebtoken.verify(token, 'temporary_secretkey') as typeof decoded;
      console.log('Decoded token:', decoded);
    } catch (err) {
      console.log('Actual token verification error:', err.message);
      throw new BadRequestException('Invalid token');
    }

    const userId = decoded.userId || decoded.sub;
    if (!userId) {
      console.log('User ID not found in token');
      throw new BadRequestException('User ID not found in token');
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      console.log('Invalid notification ID:', id);
      throw new BadRequestException('Invalid notification ID');
    }

    await this.notificationService.markNotificationAsRead(numericId, userId);
    return { success: true };
  }

  @Post('seed')
  async seedNotification(
    @Req() req: Request,
    @Body() body: { type?: string; content?: string },
  ) {
    console.log('Authorization header:', req.headers['authorization']);
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid Authorization header');
      throw new BadRequestException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    let decoded: { sub?: number; userId?: number; email?: string; role?: string };

    try {
      decoded = jsonwebtoken.verify(token, 'temporary_secretkey') as typeof decoded;
      console.log('Decoded token:', decoded);
    } catch (err) {
      console.log('Actual token verification error:', err.message);
      throw new BadRequestException('Invalid token');
    }

    const userId = decoded.userId || decoded.sub;
    if (!userId) {
      console.log('User ID not found in token');
      throw new BadRequestException('User ID not found in token');
    }

    const content = body?.content || '🔔 Test notification';
    const type = body?.type || 'info';

    await this.notificationService.createNotification({ userId, content, type });

    return { success: true, message: 'Test notification created.' };
  }
}