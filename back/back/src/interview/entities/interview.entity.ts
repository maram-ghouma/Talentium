import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@ObjectType()
@Entity()
export class Interview {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => FreelancerProfile)
  @ManyToOne(() => FreelancerProfile, (freelancer) => freelancer.interviews, { eager: true })
  freelancer: FreelancerProfile;

  @Field(() => ClientProfile)
  @ManyToOne(() => ClientProfile, (freelancer) => freelancer.interviews, { eager: true })
  client: ClientProfile;

  @Field()
  @Column()
  topic: string;

  @Field(() => GraphQLISODateTime)
  @Column({ type: 'datetime' })
  scheduledDateTime: Date;

  @Field()
  @Column({ default: false })
  remindMeF: boolean;

  @Field()
  @Column({ default: false })
  remindMeC: boolean;
}
