import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class TaskStatsInput {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  completed: number;
}

@InputType()
export class CreateMissionInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field({ defaultValue: 'not_assigned' })
  status: 'not_assigned' | 'in_progress' | 'completed';

  @Field(() => Int)
  price: number;

  @Field()
  date: string; // formatted like 'YYYY-MM-DD'

  @Field(() => Int)
  clientId: number;

  @Field(() => [String])
  requiredSkills: string[];

  @Field()
  deadline: Date;

  @Field()
  budget: string;

  @Field()
  clientName: string;

  @Field(() => Int, { defaultValue: 0 })
  progress: number;

  @Field(() => TaskStatsInput, { defaultValue: { total: 0, completed: 0 } })
  tasks: TaskStatsInput;
}
