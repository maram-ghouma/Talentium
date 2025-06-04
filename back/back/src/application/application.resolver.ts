
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Application } from './entities/application.entity';
import { ApplicationService } from './application.service';
import { CreateApplicationInput } from './dto/create-application.input';
import { GqlCurrentUser } from 'src/auth/decorators/gql-current-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth-guard';
import { UpdateApplicationInput } from './dto/update-application.input';

@Resolver(() => Application)
export class ApplicationResolver {
  constructor(private readonly applicationService: ApplicationService) {}

  @Mutation(() => Application)
  @UseGuards(GqlAuthGuard)
  async createApplication(
    @Args('createApplicationInput') createApplicationInput: CreateApplicationInput,
    @GqlCurrentUser() freelancer :any 
  ): Promise<Application> {
    return this.applicationService.create(createApplicationInput,  freelancer);
  }
  @Query(() => [Application], { name: 'applications' })
  @UseGuards(GqlAuthGuard)
  findAll(): Promise<Application[]> {
    return this.applicationService.findAll();
  }
  @Query(() => [Application], { name: 'applicationsByMission' })
  @UseGuards(GqlAuthGuard)
  findByMission(@Args('missionId') missionId: string): Promise<Application[]> {
    return this.applicationService.findByMission(missionId);
  }

  @Query(() => [Application], { name: 'applicationsByFreelancer' })
@UseGuards(GqlAuthGuard)
  findByFreelancer(@Args('freelancerId') freelancerId: string): Promise<Application[]> {
    return this.applicationService.findByFreelancer(freelancerId);
  }

  @Query(() => Application, { name: 'application' })
  @UseGuards(GqlAuthGuard)
  findOne(@Args('id') id: string): Promise<Application> {
    return this.applicationService.findOne(id);
  }

  @Mutation(() => Application)
  @UseGuards(GqlAuthGuard)
  updateApplication(
    @Args('id') id: string,
    @Args('updateApplicationInput') updateApplicationInput: UpdateApplicationInput
  ): Promise<Application> {
    return this.applicationService.update(id, updateApplicationInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeApplication(@Args('id') id: string): Promise<boolean> {
    return this.applicationService.remove(id);
  }
}
