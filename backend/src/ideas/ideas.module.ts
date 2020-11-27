import { Module } from '@nestjs/common';
import { ExtrinsicsModule } from "../extrinsics/extrinsics.module";
import { IdeaProposalsController } from "./ideaProposals/idea.proposals.controller";
import { IdeaProposalsService } from "./ideaProposals/idea.proposals.service";
import { IdeasController } from './ideas.controller';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from './idea.entity';
import { IdeasService } from './ideas.service';
import { IdeaNetwork } from './ideaNetwork.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Idea]), TypeOrmModule.forFeature([IdeaNetwork]), ExtrinsicsModule],
  providers: [IdeasService, IdeaProposalsService],
  controllers: [IdeasController, IdeaProposalsController],
  exports: [IdeasService]
})
export class IdeasModule {}
