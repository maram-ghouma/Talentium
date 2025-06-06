export enum BadgeType {
  BEGINNER = 'BEGINNER',
  ADVANCED = 'ADVANCED',
  CERTIFIED = 'CERTIFIED',
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Badge {
  @PrimaryGeneratedColumn()
@Field(() => ID)
  id: number;

  @Column({
    type: 'enum',
    enum: BadgeType,
    unique: true,
  })
  @Field(() => BadgeType)
  type: BadgeType;

  @Column()
  @Field()
  description: string;

  @ManyToMany(() => User, user => user.badges)
  @JoinTable()
  users: User[];
}
