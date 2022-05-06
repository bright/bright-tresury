import { Module } from '@nestjs/common'
import { SessionModule } from '../auth/session/session.module'
import { ExtrinsicsModule } from '../extrinsics/extrinsics.module'
import { TipsService } from './tips.service'
import { TipsController } from './tips.controller'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TipEntity } from './tip.entity'
import { UsersModule } from '../users/users.module'
import { PolkassemblyModule } from '../polkassembly/polkassembly.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([TipEntity]),
        BlockchainModule,
        UsersModule,
        ExtrinsicsModule,
        SessionModule,
        PolkassemblyModule,
    ],
    controllers: [TipsController],
    providers: [TipsService],
    exports: [TipsService],
})
export class TipsModule {}
