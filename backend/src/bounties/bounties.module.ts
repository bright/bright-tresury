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
import { ChildBountiesService } from './child-bounties/child-bounties.service'
import { ChildBountiesController } from './child-bounties/child-bounties.controller'
import { ChildBountyEntity } from './child-bounties/entities/child-bounty.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([BountyEntity, ChildBountyEntity]),
        SessionModule,
        ExtrinsicsModule,
        BlockchainModule,
        PolkassemblyModule,
        UsersModule,
    ],
    controllers: [BountiesController, ChildBountiesController],
    providers: [BountiesService, ChildBountiesService],
    exports: [BountiesService, ChildBountiesService],
})
export class BountiesModule {}
