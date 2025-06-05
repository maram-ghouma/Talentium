import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Mission } from 'src/mission/entities/mission.entity';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';

export enum ApplicationStatus {
  PENDING = 'pending',
  PRE_SELECTED = 'pre-selected',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

registerEnumType(ApplicationStatus, {
  name: 'ApplicationStatus',
});

@ObjectType()
@Entity('applications')
export class Application {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('text')
  message: string;

@Field()
@Column({ default: '' }) 
resumePath: string;


  @Field(() => ApplicationStatus)
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING
  })
  status: ApplicationStatus;

  @Field(() => Mission)
  @ManyToOne(() => Mission, mission => mission.applications, { eager: true })
  mission: Mission;

  @Field()
  @Column()
  missionId: string;

  @Field(() => FreelancerProfile)
  @ManyToOne(() => FreelancerProfile, freelancer => freelancer.applications, { eager: true })
  freelancer: FreelancerProfile;

  @Field()
  @Column()
  freelancerId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}