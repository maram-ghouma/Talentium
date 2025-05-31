import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';

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

  @Field()
  @Column({ type: 'date' })
  date: string;

  @Field(() => User)
  @ManyToOne(() => User)
  client: User;

  @Field(() => [String])
  @Column('simple-array')
  requiredSkills: string[];

  @Field()
  @Column({ type: 'date' })
  deadline: Date;

  @Field()
  @Column()
  budget: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  clientName: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  progress: number;

  @Field(() => TaskStats)
@Column('json',  { nullable: true })
  tasks: {
    total: number;
    completed: number;
  };

  @ManyToMany(() => FreelancerProfile)
  @JoinTable()
  preselectedFreelancers: FreelancerProfile[];

  @ManyToOne(() => FreelancerProfile, (freelancer) => freelancer.selectedMissions, { nullable: true })
  selectedFreelancer?: FreelancerProfile;

}

@ObjectType()
class TaskStats {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  completed: number;
}
