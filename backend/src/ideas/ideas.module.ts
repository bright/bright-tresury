import { Module } from '@nestjs/common';
import { ExtrinsicsModule } from "../extrinsics/extrinsics.module";
import { IdeaProposalsController } from "./ideaProposals/idea.proposals.controller";
import { IdeaProposalsService } from "./ideaProposals/idea.proposals.service";
import { IdeasController } from './ideas.controller';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from './entities/idea.entity';
import { IdeasService } from './ideas.service';
import { IdeaNetwork } from './entities/ideaNetwork.entity';
import {IdeaMilestone} from "./ideaMilestones/entities/idea.milestone.entity";
import {IdeaMilestoneNetwork} from "./ideaMilestones/entities/idea.milestone.network.entity";
import {IdeaMilestonesController} from "./ideaMilestones/idea.milestones.controller";
import {IdeaMilestonesService} from "./ideaMilestones/idea.milestones.service";

@Module({
  imports: [
      DatabaseModule,
      ExtrinsicsModule,
      TypeOrmModule.forFeature([Idea]),
      TypeOrmModule.forFeature([IdeaNetwork]),
      TypeOrmModule.forFeature([IdeaMilestone]),
      TypeOrmModule.forFeature([IdeaMilestoneNetwork]),
  ],
  providers: [
      IdeasService,
      IdeaProposalsService,
      IdeaMilestonesService
  ],
  controllers: [
      IdeasController,
      IdeaProposalsController,
      IdeaMilestonesController
  ],
  exports: [IdeasService]
})
export class IdeasModule {}
