
import { Resolver, Query, Mutation, Args, Context, ID } from '@nestjs/graphql';
import { UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Application, ApplicationStatus } from './entities/application.entity';
import { ApplicationService } from './application.service';
import { CreateApplicationInput } from './dto/create-application.input';
import { GqlCurrentUser } from 'src/auth/decorators/gql-current-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth-guard';
import { UpdateApplicationInput } from './dto/update-application.input';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { Roles } from 'src/auth/decorators/role.decorator';
import { GqlRolesGuard } from 'src/auth/guards/GqlRoleGuard';

@Resolver(() => Application)
export class ApplicationResolver {
  constructor(private readonly applicationService: ApplicationService) {}

  @UseGuards(GqlAuthGuard,GqlRolesGuard)
  @Roles('freelancer')
  @Mutation(() => Application)
  async createApplication(
    @Args('createApplicationInput') createApplicationInput: CreateApplicationInput,
    @GqlCurrentUser() freelancer :any 
  ): Promise<Application> {
    return this.applicationService.create(createApplicationInput,  freelancer);
  }

  @UseGuards(GqlAuthGuard,GqlRolesGuard)
  @Roles('client')
  @Query(() => [Application], { name: 'applications' })
  findAll(): Promise<Application[]> {
    return this.applicationService.findAll();
  }

  @UseGuards(GqlAuthGuard,GqlRolesGuard)
  @Roles('client')
  @Query(() => [Application], { name: 'applicationsByMission' })
  findByMission(@Args('missionId') missionId: string): Promise<Application[]> {
    return this.applicationService.findByMission(missionId);
  }

  @Query(() => [Application], { name: 'myApplicationsByMission' })
  @UseGuards(GqlAuthGuard)
  findMineByMission(@Args('missionId') missionId: string,@GqlCurrentUser() user:any): Promise<Application[]> {
    return this.applicationService.findMineByMission(missionId,user);
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

    @UseGuards(GqlAuthGuard,GqlRolesGuard)
    @Roles('client')
  @Mutation(() => Application)
  async updateApplicationStatus(
    @Args('applicationId', { type: () => ID }) applicationId: string,
    @Args('newStatus', { type: () => ApplicationStatus }) newStatus: ApplicationStatus,
  ): Promise<Application> {
    return this.applicationService.updateApplicationStatus(applicationId, newStatus);
  }

    @UseGuards(GqlAuthGuard,GqlRolesGuard)
    @Roles('client')
  @Query(() => [FreelancerProfile])
  getFreelancersWhoAppliedToMyMissions(@GqlCurrentUser() user:any) {
  return this.applicationService.getFreelancersByClient(user.userId);
}

}
