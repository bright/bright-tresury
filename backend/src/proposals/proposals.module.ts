import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from '../auth/session/session.module'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { DatabaseModule } from '../database/database.module'
import { IdeaProposalDetailsModule } from '../idea-proposal-details/idea-proposal-details.module'
import { Proposal } from './proposal.entity'
import { ProposalsController } from './proposals.controller'
import { ProposalsService } from './proposals.service'
import { ConfigModule } from '../config/config.module'
import { IsValidNetworkConstraint } from '../utils/network.validator'

@Module({
    imports: [
        DatabaseModule,
        ConfigModule,
        BlockchainModule,
        SessionModule,
        IdeaProposalDetailsModule,
        TypeOrmModule.forFeature([Proposal]),
    ],
    controllers: [ProposalsController],
    providers: [ProposalsService, IsValidNetworkConstraint],
    exports: [ProposalsService],
})
export class ProposalsModule {}
