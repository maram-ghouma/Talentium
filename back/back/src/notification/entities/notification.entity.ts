// src/notification/entities/notification.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
@Entity()
export class Notification {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  type: string; // e.g., 'task_assigned', 'payment_received'

  @Field()
  @Column('text')
  content: string; // e.g., 'You were assigned to Task #123'

  @Field(() => Int)
  @Column()
  userId: number; // Recipient

  @Field()
  @Column({ default: false })
  isRead: boolean;

  @Field()
  @Column()
  timestamp: Date;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}