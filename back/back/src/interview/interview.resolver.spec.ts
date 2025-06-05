import { Test, TestingModule } from '@nestjs/testing';
import { InterviewResolver } from './interview.resolver';
import { InterviewService } from './interview.service';

describe('InterviewResolver', () => {
  let resolver: InterviewResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterviewResolver, InterviewService],
    }).compile();

    resolver = module.get<InterviewResolver>(InterviewResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
