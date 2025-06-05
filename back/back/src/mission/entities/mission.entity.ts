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
import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { GraphQLDate } from 'graphql-scalars';
import { Dispute } from 'src/dispute/entities/dispute.entity';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { Application } from 'src/application/entities/application.entity';

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

  @Field(() => ClientProfile)
  @ManyToOne(() => ClientProfile)
  client: ClientProfile;

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
  @Column({  default: "john Client" })
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

  @Field(() => FreelancerProfile, { nullable: true })
  @ManyToMany(() => FreelancerProfile)
  @JoinTable()
  preselectedFreelancers: FreelancerProfile[];

  @Field(() => FreelancerProfile, { nullable: true })
  @ManyToOne(() => FreelancerProfile, (freelancer) => freelancer.selectedMissions, { nullable: true })
  selectedFreelancer?: FreelancerProfile;
  
  @Field(() => [Dispute])
  @OneToMany(() => Dispute, (dispute) => dispute.mission)
  disputes: Dispute[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  paymentIntentId?: string; 

  @Field({ nullable: true })
  @Column({ nullable: true })
  paymentStatus?: string;

  @Field(() => [Application], { nullable: true })
  @OneToMany(() => Application, application => application.mission)
  applications?: Application[];

}

@ObjectType()
class TaskStats {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  completed: number;
}
