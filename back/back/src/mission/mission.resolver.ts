import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MissionService } from './mission.service';
import { Mission } from './entities/mission.entity';
import { CreateMissionInput } from './dto/create-mission.input';
import { UpdateMissionInput } from './dto/update-mission.input';
import { GqlCurrentUser } from 'src/auth/decorators/gql-current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => Mission)
export class MissionResolver {
  constructor(private readonly missionService: MissionService) {}

  @Mutation(() => Mission)
  createMission(@Args('createMissionInput') createMissionInput: CreateMissionInput,@GqlCurrentUser() User : User) {
    return this.missionService.create(createMissionInput,User);
  }

  @Query(() => [Mission], { name: 'missions' })
  findAll(@GqlCurrentUser() user : User) {
    return this.missionService.findAll(user);
  }

  @Query(() => Mission, { name: 'mission' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.missionService.findOne(id);
  }

  @Mutation(() => Mission)
  updateMission(@Args('updateMissionInput') updateMissionInput: UpdateMissionInput) {
    return this.missionService.update(updateMissionInput.id, updateMissionInput);
  }

@Mutation(() => Boolean)
removeMission(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
  return this.missionService.remove(id);
}

}
