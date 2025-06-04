import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Max, Min } from 'class-validator';
import { Mission } from 'src/mission/entities/mission.entity';
import { User } from 'src/user/entities/user.entity';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Review {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Float)
  @Column({ type: 'float' })
  @Min(1, { message: 'Stars must be at least 1' })
  @Max(5, { message: 'Stars must be at most 5' })
  stars: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  comment: string;

  @Field(() => String)
  @CreateDateColumn()
  date: string;

  @Field(() => User)
  @ManyToOne(() => User)
  reviewer: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.reviews)
  reviewedUser: User;

  @Field(() => Mission)
  @ManyToOne(() => Mission, { eager: true })
  mission: Mission;
}
