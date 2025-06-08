import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { InterviewService } from './interview.service';
import { Interview } from './entities/interview.entity';
import { CreateInterviewInput } from './dto/create-interview.input';
import { UpdateInterviewInput } from './dto/update-interview.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth-guard';
import { GqlCurrentUser } from 'src/auth/decorators/gql-current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Roles } from 'src/auth/decorators/role.decorator';
import { GqlRolesGuard } from 'src/auth/guards/GqlRoleGuard';

@Resolver(() => Interview)
export class InterviewResolver {
  constructor(private readonly interviewService: InterviewService) {}

  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles('client')
  @Mutation(() => Interview)
  createInterview(
    @Args('input') input: CreateInterviewInput,
    @GqlCurrentUser() user: any,
  ) {
    return this.interviewService.create(input, user);
  }

  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles('client', 'freelancer')
  @Query(() => [Interview])
  interviews(
    @Args('type', { type: () => String }) type: string, // Changed String to string
    @GqlCurrentUser() user: any,
  ) {
    return this.interviewService.findAll(type, user);
  }

  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles('client', 'freelancer')
  @Mutation(() => Interview)
  remindMe(
    @Args('interviewId', { type: () => String }) interviewId: string, // Changed String to string
    @GqlCurrentUser() user: any,
  ) {
    return this.interviewService.switchRemindMe(interviewId, user);
  }

  @UseGuards(GqlAuthGuard, GqlRolesGuard) // Added guards for consistency
  @Roles('client', 'freelancer') // Adjust roles as needed
  @Query(() => Interview)
  interview(@Args('id', { type: () => Int }) id: number) {
    return this.interviewService.findOne(id.toString());
  }

  @UseGuards(GqlAuthGuard, GqlRolesGuard) // Added guards for security
  @Roles('client') // Adjust roles as needed
  @Mutation(() => Interview)
  updateInterview(
    @Args('input') input: UpdateInterviewInput,
    @GqlCurrentUser() user: any, // Added user for authorization
  ) {
    return this.interviewService.update(input);
  }

  @UseGuards(GqlAuthGuard, GqlRolesGuard) // Added guards for security
  @Roles('client') // Adjust roles as needed
  @Mutation(() => Boolean)
  removeInterview(
    @Args('id', { type: () => Int }) id: number,
    @GqlCurrentUser() user: any, // Added user for authorization
  ) {
    return this.interviewService.remove(id.toString());
  }

  /*
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles('client', 'freelancer')
  @Query(() => [Interview])
  getInterviewsByFreelancer(@Args('freelancerId', { type: () => Int }) freelancerId: number) {
    return this.interviewService.findByFreelancer(freelancerId);
  }

  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles('client', 'freelancer')
  @Query(() => [Interview])
  getInterviewsByClient(@Args('clientId', { type: () => Int }) clientId: number) {
    return this.interviewService.findByClient(clientId);
  }*/
}