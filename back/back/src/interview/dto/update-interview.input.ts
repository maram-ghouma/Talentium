import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateInterviewInput } from './create-interview.input';

@InputType()
export class UpdateInterviewInput extends PartialType(CreateInterviewInput) {
  @Field(() => ID)
  id: number;
}
