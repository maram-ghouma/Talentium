
import { Application } from 'src/application/entities/application.entity';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Mission } from 'src/mission/entities/mission.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@ObjectType()
@Entity()
export class FreelancerProfile {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Field(() => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  skills: string[];

  @Field()
  @Column()
  phoneNumber: string;

  @Field()
  @Column()
  country: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  linkedIn: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  github: string;

  @Field(() => Float, { nullable: true })
  @Column({ nullable: true })
  hourlyRate: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bio: string;

  @Field(() => [Mission], { nullable: true })
  @OneToMany(() => Mission, (mission) => mission.selectedFreelancer)
  selectedMissions: Mission[];

  @Field(() => [Application], { nullable: true })
@OneToMany(() => Application, application => application.freelancer)
applications?: Application[];
  

  @Field({ nullable: true })
  @Column({ nullable: true })
  stripeAccountId: string;
}
