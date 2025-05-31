import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MissionService } from './mission.service';
import { Mission } from './entities/mission.entity';
import { CreateMissionInput } from './dto/create-mission.input';
import { UpdateMissionInput } from './dto/update-mission.input';

@Resolver(() => Mission)
export class MissionResolver {
  constructor(private readonly missionService: MissionService) {}

  @Mutation(() => Mission)
  createMission(@Args('createMissionInput') createMissionInput: CreateMissionInput) {
    return this.missionService.create(createMissionInput);
  }

  @Query(() => [Mission], { name: 'missions' })
  findAll() {
    return this.missionService.findAll();
  }

  @Query(() => Mission, { name: 'mission' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.missionService.findOne(id);
  }

  @Mutation(() => Mission)
  updateMission(@Args('updateMissionInput') updateMissionInput: UpdateMissionInput) {
    return this.missionService.update(updateMissionInput.id, updateMissionInput);
  }

  @Mutation(() => Mission)
  removeMission(@Args('id', { type: () => Int }) id: number) {
    return this.missionService.remove(id);
  }
}
