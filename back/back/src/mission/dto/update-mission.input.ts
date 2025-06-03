import { CreateMissionInput } from './create-mission.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMissionInput extends PartialType(CreateMissionInput) {
  @Field(() => Int)
  id: number;
}
