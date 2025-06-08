import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Mission } from 'src/mission/entities/mission.entity';
import { Message } from './message.entity';

@ObjectType()
@Entity()
export class Conversation {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  startDate: Date;

  @Field(() => Mission)
  @ManyToOne(() => Mission, (mission) => mission.conversations, { onDelete: 'CASCADE' })
  mission: Mission;

  @Field(() => [User])
  @ManyToMany(() => User)
  @JoinTable({
  name: 'conversation_participants',
  joinColumn: { name: 'conversation_id', referencedColumnName: 'id' },
  inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  participants: User[];


  @Field(() => [Message])
  @OneToMany(() => Message, (message) => message.conversation, { cascade: true })
  messages: Message[];
}
