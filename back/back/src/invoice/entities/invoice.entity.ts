import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Mission } from "src/mission/entities/mission.entity";
import { FreelancerProfile } from "src/freelancer-profile/entities/freelancer-profile.entity";

@ObjectType()
@Entity()
export class Invoice {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => Number)
    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Field(() => String)
    @CreateDateColumn()
    date: string;

    @Field(() => String)
    @Column()
    description: string;

    @Field(() => Number)
    @Column()
    clientId: number;

    @Field(() => Number, { nullable: true })
    @Column({ nullable: true })
    freelancerId?: number;

    @Field(() => Number)
    @Column()
    missionId: number;

    // Add relations for better querying
    @Field(() => User)
    @ManyToOne(() => User)
    client: User;

    @Field(() => FreelancerProfile, { nullable: true })
    @ManyToOne(() => FreelancerProfile, { nullable: true })
    freelancer?: FreelancerProfile;

    @Field(() => Mission)
    @ManyToOne(() => Mission)
    mission: Mission;
}