// freelancer-profile/freelancer-profile.entity.ts
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class FreelancerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

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

  @Column({ nullable: true })
  bio: string;
}
