// freelancer-profile/freelancer-profile.entity.ts
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Application } from 'src/application/entities/application.entity';
import { Mission } from 'src/mission/entities/mission.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
@ObjectType()
@Entity()
export class FreelancerProfile {
  @Field(()=>ID)
  @PrimaryGeneratedColumn()
  id: number;
  @Field(()=>User)
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

@Field(() => [String], { nullable: true })
@Column('simple-array', { nullable: true })
skills: string[];


  @Column()
  phoneNumber: string;

  @Column()
  country : string;

   @Column({ nullable: true })
  linkedIn: string;

   @Column({ nullable: true })
  github: string;

  @Column({ nullable: true })
  hourlyRate: number;

  @Field({nullable: true})
  @Column({ nullable: true })
  bio: string;

  @Field(()=>[Mission])
  @OneToMany(() => Mission, (mission) => mission.selectedFreelancer)
  selectedMissions: Mission[];

  @Field(() => [Application], { nullable: true })
  @OneToMany(() => Application, application => application.freelancer)
  applications?: Application[];

   @Column({ nullable: true })
   
  stripeAccountId: string; 

}
