import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
@ObjectType()
@Entity()
export class ClientProfile {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;
  @Field()
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @Field()
  @Column()
  companyName: string;
  @Field()
  @Column()
  industry: string;
}
