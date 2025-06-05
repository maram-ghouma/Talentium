import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateApplicationInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  message: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  missionId: string;

}