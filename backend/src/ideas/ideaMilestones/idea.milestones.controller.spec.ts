import {IdeaMilestonesController} from "./idea.milestones.controller";
import {Test, TestingModule} from "@nestjs/testing";

describe('IdeaMilestonesController', () => {
  let controller: IdeaMilestonesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdeaMilestonesController],
    }).compile();

    controller = module.get<IdeaMilestonesController>(IdeaMilestonesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
