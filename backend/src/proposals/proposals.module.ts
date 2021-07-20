import { Module } from '@nestjs/common'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { DatabaseModule } from '../database/database.module'
import { IdeasModule } from '../ideas/ideas.module'
import { ProposalsController } from './proposals.controller'
import { ProposalsService } from './proposals.service'
import { ConfigModule } from '../config/config.module'
import { IsValidNetworkConstraint } from '../utils/network.validator'

@Module({
    imports: [DatabaseModule, ConfigModule, BlockchainModule, IdeasModule],
    controllers: [ProposalsController],
    providers: [ProposalsService, IsValidNetworkConstraint],
})
export class ProposalsModule {}
