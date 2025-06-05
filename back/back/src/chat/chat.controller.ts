import { Controller, Get, Req, BadRequestException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
async getConversations(@Req() req: Request) {
  console.log('Authorization header:', req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Missing or invalid Authorization header');
    throw new BadRequestException('Missing or invalid Authorization header');
  }

  const token = authHeader.split(' ')[1];
  let decoded: { sub?: number; userId?: number; email: string; role: string };

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

  // This is where your real bug is likely hiding
  const conversations = await this.chatService.getConversations(userId);
  console.log('Conversations:', conversations);

  return {
    userId,
    conversations,
  };
}
}