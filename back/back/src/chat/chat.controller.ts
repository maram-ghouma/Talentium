import { Controller, Get, Post, Req, BadRequestException, UploadedFile, UseInterceptors, Body, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
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

    const conversations = await this.chatService.getConversations(userId);
    console.log('Conversations:', conversations);

    return {
      userId,
      conversations,
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Ensure this directory exists
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      // Optional: Restrict file types (e.g., images, PDFs, docs)
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Allowed: JPEG, PNG, PDF, DOC, DOCX'), false);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('conversationId') conversationId: string,
    @Req() req: Request,
  ) {
    // Validate authorization
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

    const senderId = decoded.userId || decoded.sub;
    if (!senderId) {
      console.log('User ID not found in token');
      throw new BadRequestException('User ID not found in token');
    }

    // Validate file and conversationId
    if (!file) {
      throw new NotFoundException('No file uploaded');
    }
    if (!conversationId) {
      throw new BadRequestException('Conversation ID is required');
    }

    // Save file message
    const savedMessage = await this.chatService.saveFileMessage({
      conversationId: parseInt(conversationId),
      senderId,
      fileName: file.filename,
      originalName: file.originalname,
      filePath: join('uploads', file.filename), // Relative path for client access
    });

    // Return file metadata for frontend
    return {
      id: savedMessage.id,
      fileName: savedMessage.fileName,
      originalName: savedMessage.originalName,
      path: savedMessage.filePath,
    };
  }
}