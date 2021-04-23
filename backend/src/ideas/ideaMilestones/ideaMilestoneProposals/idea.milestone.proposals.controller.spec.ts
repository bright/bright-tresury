import { Test, TestingModule } from '@nestjs/testing';
import {IdeaMilestoneProposalsController} from "./idea.milestone.proposals.controller";

describe('/api/v1/ideas/:ideaId/milestones/:ideaMilestoneId/proposals', () => {

  let controller: IdeaMilestoneProposalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Idea.Milestone.ProposalsController],
    }).compile();

    controller = module.get<Idea.Milestone.ProposalsController>(Idea.Milestone.ProposalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
