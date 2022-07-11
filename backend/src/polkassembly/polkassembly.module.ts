import { Module } from '@nestjs/common'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { PolkassemblyBountiesService } from './bounties/polkassembly-bounties.service'
import { PolkassemblyService } from './polkassembly.service'
import { PolkassemblyTreasuryProposalsService } from './treasury-proposals/polkassembly-treasury-proposals.service'
import { PolkassemblyTipsService } from './tips/polkassembly-tips.service'
import { PolkassemblyChildBountiesService } from './childBounties/polkassembly-childBounties.service'

@Module({
    imports: [BlockchainModule],
    providers: [
        PolkassemblyService,
        PolkassemblyBountiesService,
        PolkassemblyTreasuryProposalsService,
        PolkassemblyTipsService,
        PolkassemblyChildBountiesService,
    ],
    exports: [
        PolkassemblyBountiesService,
        PolkassemblyTreasuryProposalsService,
        PolkassemblyTipsService,
        PolkassemblyChildBountiesService,
    ],
})
export class PolkassemblyModule {}
