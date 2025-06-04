import { Controller, Get, Req, BadRequestException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  async getConversations(@Req() req: Request) {
    console.log('Authorization header:', req.headers.authorization); // Debug
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid Authorization header');
      throw new BadRequestException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jsonwebtoken.verify(token, 'temporary_secretkey') as {
        sub?: number;
        userId?: number;
        email: string;
        role: string;
      };
      console.log('Decoded token:', decoded); // Debug
      const userId = decoded.userId || decoded.sub;
      if (!userId) {
        console.log('User ID not found in token');
        throw new BadRequestException('User ID not found in token');
      }
      const conversations = await this.chatService.getConversations(userId);
      console.log('Conversations:', conversations); // Debug
      return {
        userId,
        conversations,
      };
    } catch (err) {
      console.log('Token verification error:', err.message); // Debug
      throw new BadRequestException('Invalid token');
    }
  }
}