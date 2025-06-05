import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateInterviewInput {
  @Field()
  freelancerId: number;

  @Field()
  topic: string;

  @Field()
  scheduledDateTime: string;

  @Field({ defaultValue: false })
  remindMe: boolean;
}
