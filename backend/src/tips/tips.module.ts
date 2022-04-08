import { Module } from '@nestjs/common'
import { TipsService } from './tips.service'
import { TipsController } from './tips.controller'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TipEntity } from './tip.entity'
import { UsersModule } from '../users/users.module'

@Module({
    imports: [TypeOrmModule.forFeature([TipEntity]), BlockchainModule, UsersModule],
    controllers: [TipsController],
    providers: [TipsService],
})
export class TipsModule {}
