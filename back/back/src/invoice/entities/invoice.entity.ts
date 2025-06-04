import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";



@ObjectType()
export class Invoice {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => Number)
    @Column()
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

    @Field(() => Number)
    @Column()
    freelancerId: number;

    @Field(() => Number)
    @Column()
    missionId: number;

}
