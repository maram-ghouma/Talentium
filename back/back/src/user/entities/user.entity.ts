import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

export enum UserRole {
  CLIENT = 'client',
  FREELANCER = 'freelancer',
  ADMIN = 'admin',
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

   @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.FREELANCER })
  currentRole: UserRole;
}
