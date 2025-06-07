
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { ApplicationStatus } from '../entities/application.entity';

@InputType()
export class UpdateApplicationInput {
  @Field({ nullable: true })
  message?: string;

  @Field(() => ApplicationStatus, { nullable: true })
  status?: ApplicationStatus;
}
