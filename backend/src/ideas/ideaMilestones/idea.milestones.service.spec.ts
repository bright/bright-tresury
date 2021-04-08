import {Test, TestingModule} from "@nestjs/testing";
import {IdeaMilestonesService} from "./idea.milestones.service";

describe('IdeaMilestonesService', () => {
  let service: IdeaMilestonesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdeaMilestonesService],
    }).compile();

    service = module.get<IdeaMilestonesService>(IdeaMilestonesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
