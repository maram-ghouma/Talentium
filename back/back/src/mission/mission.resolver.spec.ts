import { Test, TestingModule } from '@nestjs/testing';
import { MissionResolver } from './mission.resolver';
import { MissionService } from './mission.service';

describe('MissionResolver', () => {
  let resolver: MissionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MissionResolver, MissionService],
    }).compile();

    resolver = module.get<MissionResolver>(MissionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
