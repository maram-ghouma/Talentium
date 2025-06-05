import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { InterviewService } from './interview.service';
import { Interview } from './entities/interview.entity';
import { CreateInterviewInput } from './dto/create-interview.input';
import { UpdateInterviewInput } from './dto/update-interview.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth-guard';
import { GqlCurrentUser } from 'src/auth/decorators/gql-current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => Interview)
export class InterviewResolver {
  constructor(private readonly interviewService: InterviewService) {}
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Interview)
  createInterview(@Args('input') input: CreateInterviewInput,@GqlCurrentUser() user : any) {
    return this.interviewService.create(input,user);
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => [Interview])
  interviews(@Args('type', { type: () => String }) type: String,@GqlCurrentUser() user : any) {
    return this.interviewService.findAll(type,user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Interview)
  remindMe(@Args('interviewId', { type: () => String }) interviewId: String,@GqlCurrentUser() user : any) {
    return this.interviewService.switchRemindMe(interviewId,user);
  }

  @Query(() => Interview)
  interview(@Args('id', { type: () => Int }) id: number) {
    return this.interviewService.findOne(id.toString());
  }

  @Mutation(() => Interview)
  updateInterview(@Args('input') input: UpdateInterviewInput) {
    return this.interviewService.update(input);
  }

  @Mutation(() => Boolean)
  removeInterview(@Args('id', { type: () => Int }) id: number) {
    return this.interviewService.remove(id.toString());
  }
/*
  @Query(() => [Interview])
  getInterviewsByFreelancer(@Args('freelancerId', { type: () => Int }) freelancerId: number) {
    return this.interviewService.findByFreelancer(freelancerId);
  }

  @Query(() => [Interview])
  getInterviewsByClient(@Args('clientId', { type: () => Int }) clientId: number) {
    return this.interviewService.findByClient(clientId);
  }*/
}
