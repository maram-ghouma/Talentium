import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Mission } from "src/mission/entities/mission.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { registerEnumType } from '@nestjs/graphql';



export enum DisputeStatus {
  OPEN = 'OPEN',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}
registerEnumType(DisputeStatus, {
  name: 'DisputeStatus', 
  description: 'The status of a dispute',
});

@ObjectType()
@Entity()
export class Dispute {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Mission)
  @ManyToOne(() => Mission, mission => mission.disputes)
  mission: Mission;

  @Field(() => User)
  @ManyToOne(() => User)
  openedBy: User;

  @Field(() => String)
  @Column()
  reason: string;

  @Field(() => DisputeStatus)
  @Column({ type: 'enum', enum: DisputeStatus, default: DisputeStatus.OPEN })
  status: DisputeStatus;

  @Field(() => Date)
  @CreateDateColumn()
  openedAt: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  resolution: string;
}
