import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

export enum UserRole {
  CLIENT = 'client',
  FREELANCER = 'freelancer',
}
@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;
  @Field()
  @Column()
  username: string;
  @Field()
  @Column()
  email: string;
  @Field()
  @Column()
  password: string;
  @Field()
  @Column({ default: false })
  isAdmin: boolean;
  @Field()
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  currentRole: UserRole;
}
