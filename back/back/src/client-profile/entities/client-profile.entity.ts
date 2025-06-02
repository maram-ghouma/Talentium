import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class ClientProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  phoneNumber: string;

  @Column()
  country : string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  linkedIn: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  industry: string;
}
