import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Mission } from 'src/mission/entities/mission.entity';

// Define the enum for task status
export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

// Register the enum with GraphQL
registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'The status of a task',
});

@ObjectType()
@Entity()
export class Task {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column('text')
  description: string;

  @Field(() => TaskStatus)
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.NOT_STARTED,
  })
  status: TaskStatus;

  @Field(() => Mission)
  @ManyToOne(() => Mission, (mission) => mission.tasks, { onDelete: 'CASCADE' })
  mission: Mission;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}