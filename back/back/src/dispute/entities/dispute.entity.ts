import { Mission } from "src/mission/entities/mission.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum DisputeStatus {
  OPEN = 'OPEN',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

@Entity()
export class Dispute {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Mission, mission => mission.disputes)
  mission: Mission;

  @ManyToOne(() => User)
  openedBy: User;

  @Column()
  reason: string;

  @Column({ type: 'enum', enum: DisputeStatus, default: DisputeStatus.OPEN })
  status: DisputeStatus;

  @CreateDateColumn()
  openedAt: Date;

  @Column({ nullable: true })
  resolution: string;
}
