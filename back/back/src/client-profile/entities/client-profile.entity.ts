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
