import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { GraphQLDate } from 'graphql-scalars';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Task } from './task.entity';

@ObjectType()
@Entity()
export class Mission { 
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column('text')
  description: string;

  @Field()
  @Column({ default: 'not_assigned' })
  status: 'not_assigned' | 'in_progress' | 'completed';

  @Field(() => Int)
  @Column('int')
  price: number;

  @Field(() => GraphQLDate)
  @Column({ type: 'date' })
  date: string;

  @Field(() => User)
  @ManyToOne(() => User)
  client: User;

  @Field(() => [String])
  @Column('simple-array')
  requiredSkills: string[];

  @Field(() => GraphQLDate)
  @Column({ type: 'date' })
  deadline: Date;

  @Field()
  @Column()
  budget: string;

  @Field(() => GraphQLDate)
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column({ default: "john Client" })
  clientName: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  progress: number;

  @Field(() => TaskStats)
  @Column('json', { nullable: true })
  tasks: {
    total: number;
    completed: number;
  };

  @ManyToMany(() => FreelancerProfile)
  @JoinTable()
  preselectedFreelancers: FreelancerProfile[];

  @ManyToOne(() => FreelancerProfile, (freelancer) => freelancer.selectedMissions, { nullable: true })
  selectedFreelancer?: FreelancerProfile;

  @OneToMany(() => Conversation, (conversation) => conversation.mission)
  conversations: Conversation[];

  // New tasklist attribute
  @Field(() => [Task])
  @OneToMany(() => Task, (task) => task.mission, { cascade: true })
  tasklist: Task[];
}

@ObjectType()
class TaskStats {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  completed: number;
}