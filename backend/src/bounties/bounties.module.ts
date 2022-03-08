import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from '../auth/session/session.module'
import { ExtrinsicsModule } from '../extrinsics/extrinsics.module'
import { BountiesController } from './bounties.controller'
import { BountiesService } from './bounties.service'
import { BountyEntity } from './entities/bounty.entity'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { PolkassemblyModule } from '../polkassembly/polkassembly.module'
import { UsersModule } from '../users/users.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([BountyEntity]),
        SessionModule,
        ExtrinsicsModule,
        BlockchainModule,
        PolkassemblyModule,
        UsersModule,
    ],
    controllers: [BountiesController],
    providers: [BountiesService],
    exports: [BountiesService],
})
export class BountiesModule {}
