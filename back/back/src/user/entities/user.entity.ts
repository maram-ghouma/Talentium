import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

export enum UserRole {
  CLIENT = 'client',
  FREELANCER = 'freelancer',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  currentRole: UserRole;
}
