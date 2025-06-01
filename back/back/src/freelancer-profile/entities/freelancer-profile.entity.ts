// freelancer-profile/freelancer-profile.entity.ts
import { ObjectType } from '@nestjs/graphql';
import { Mission } from 'src/mission/entities/mission.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
@ObjectType()
@Entity()
export class FreelancerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column("simple-array")
  skills: string[];

  @Column()
  phoneNumber: string;

  @Column()
  country : string;

  @Column({ nullable: true })
  hourlyRate: number;

  @Column({ nullable: true })
  bio: string;

  @OneToMany(() => Mission, (mission) => mission.selectedFreelancer)
selectedMissions: Mission[];
}
