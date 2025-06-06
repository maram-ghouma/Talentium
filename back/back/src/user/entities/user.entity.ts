import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Badge } from 'src/badge/entities/badge.entity';
import { Review } from 'src/review/entities/review.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany } from 'typeorm';

export enum UserRole {
  CLIENT = 'client',
  FREELANCER = 'freelancer',
  ADMIN = 'admin',
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
  @Column({ nullable: true })
  imageUrl: string;

  @Field()
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  currentRole: UserRole;

  @Field(() => [Review], { nullable: true })
  @OneToOne(() => Review, (review) => review.reviewer, { eager: true })
  reviews: Review[];


  @ManyToMany(() => Badge, (badge) => badge.users, { eager: true })
  badges: Badge[];

}
