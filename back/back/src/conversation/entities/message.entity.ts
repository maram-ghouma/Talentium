import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
@Entity()
export class Message {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  content: string;

  @Field(() => Date)
  @CreateDateColumn()
  timestamp: Date;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  sender: User;

  @Field(() => Conversation)
  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  conversation: Conversation;

  @Column({ default: false })
  isRead: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  fileName?: string; // Unique filename stored on the server

  @Field({ nullable: true })
  @Column({ nullable: true })
  originalName?: string; // Original name of the uploaded file

  @Field({ nullable: true })
  @Column({ nullable: true })
  filePath?: string; // Path to access the file
}