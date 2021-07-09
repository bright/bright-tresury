import { Module } from '@nestjs/common'
import { StatsController } from './stats.controller'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { StatsService } from './stats.service'

@Module({
    imports: [BlockchainModule],
    controllers: [StatsController],
    providers: [StatsService],
})
export class StatsModule {}
