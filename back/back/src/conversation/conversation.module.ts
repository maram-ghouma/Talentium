import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { Conversation } from './entities/conversation.entity'; // Adjust path to your entity
import { UserModule } from '../user/user.module'; // Adjust path
import { MissionModule } from '../mission/mission.module'; // Adjust path

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    UserModule,
    MissionModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService, TypeOrmModule.forFeature([Conversation])],
})
export class ConversationModule {}