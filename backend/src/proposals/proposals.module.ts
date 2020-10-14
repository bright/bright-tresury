import { Module } from '@nestjs/common';
import { ProposalsController } from './proposals.controller';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal } from './proposal.entity';
import { ProposalsService } from './proposals.service';
import { ProposalNetwork } from './proposalNetwork.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Proposal]), TypeOrmModule.forFeature([ProposalNetwork])],
  providers: [ProposalsService],
  controllers: [ProposalsController]
})
export class ProposalsModule {}
