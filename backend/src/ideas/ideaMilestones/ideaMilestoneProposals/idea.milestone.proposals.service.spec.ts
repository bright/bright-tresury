import { Test, TestingModule } from '@nestjs/testing';
import { IdeaMilestoneProposalsService } from './idea.milestone.proposals.service';

describe('/api/v1/ideas/:ideaId/milestones/:ideaMilestoneId/proposals', () => {

  let service: IdeaMilestoneProposalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdeaMilestoneProposalsService],
    }).compile();

    service = module.get<IdeaMilestoneProposalsService>(IdeaMilestoneProposalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
