import { Module } from '@nestjs/common'
import { SessionModule } from '../auth/session/session.module'
import { ExtrinsicsModule } from '../extrinsics/extrinsics.module'
import { TipsService } from './tips.service'
import { TipsController } from './tips.controller'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TipEntity } from './tip.entity'
import { UsersModule } from '../users/users.module'

@Module({
    imports: [TypeOrmModule.forFeature([TipEntity]), BlockchainModule, UsersModule, ExtrinsicsModule, SessionModule],
    controllers: [TipsController],
    providers: [TipsService],
})
export class TipsModule {}
