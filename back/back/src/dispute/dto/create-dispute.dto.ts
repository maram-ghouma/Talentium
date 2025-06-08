import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateDisputeDto {
  @Field(() => ID)
  @IsNotEmpty()
  missionId: number;

  @Field()
  @IsNotEmpty()
  reason: string;
}
