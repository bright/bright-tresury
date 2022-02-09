import { Module } from '@nestjs/common'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { PolkassemblyBountiesService } from './bounties/polkassembly-bounties.service'
import { PolkassemblyService } from './polkassembly.service'
import { PolkassemblyTreasuryProposalsService } from './treasury-proposals/polkassembly-treasury-proposals.service'

@Module({
    imports: [BlockchainModule],
    providers: [PolkassemblyService, PolkassemblyBountiesService, PolkassemblyTreasuryProposalsService],
    exports: [PolkassemblyBountiesService, PolkassemblyTreasuryProposalsService],
})
export class PolkassemblyModule {}
