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

  @Column("simple-array")
  skills: string[];

  @Column()
  hourlyRate: number;

  @Column()
  bio: string;
}
