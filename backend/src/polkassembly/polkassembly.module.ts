import { Module } from '@nestjs/common'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { PolkassemblyService } from './polkassembly.service'


@Module({
    imports: [BlockchainModule],
    providers: [PolkassemblyService],
    exports: [PolkassemblyService]
})
export class PolkassemblyModule {}
