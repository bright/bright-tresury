import { Module } from '@nestjs/common'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { PolkassemblyBountiesService } from './bounties/polkassembly-bounties.service'
import { PolkassemblyService } from './polkassembly.service'
import { PolkassemblyTreasuryProposalsService } from './treasury-proposals/polkassembly-treasury-proposals.service'
import { PolkassemblyTipsService } from './tips/polkassembly-tips.service'

@Module({
    imports: [BlockchainModule],
    providers: [
        PolkassemblyService,
        PolkassemblyBountiesService,
        PolkassemblyTreasuryProposalsService,
        PolkassemblyTipsService,
    ],
    exports: [PolkassemblyBountiesService, PolkassemblyTreasuryProposalsService, PolkassemblyTipsService],
})
export class PolkassemblyModule {}
