import { Test, TestingModule } from '@nestjs/testing';
import {IdeaMilestoneProposalsController} from "./idea.milestone.proposals.controller";

describe('/api/v1/ideas/:ideaId/milestones/:ideaMilestoneId/proposals', () => {

  let controller: IdeaMilestoneProposalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdeaMilestoneProposalsController],
    }).compile();

    controller = module.get<IdeaMilestoneProposalsController>(IdeaMilestoneProposalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
