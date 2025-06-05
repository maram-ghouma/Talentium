import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Interview } from 'src/interview/entities/interview.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
@ObjectType()
@Entity()
export class ClientProfile {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;
  @Field(()=>User)
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

  @Field(() => [Interview], { nullable: true })
  @OneToMany(() => Interview, (interview) =>interview.client)
  interviews: Interview[];
}
