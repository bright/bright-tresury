import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { DatabaseModule } from '../database/database.module'
import { ExtrinsicEntity } from './extrinsic.entity'
import { ExtrinsicsService } from './extrinsics.service'

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([ExtrinsicEntity]), BlockchainModule],
    providers: [ExtrinsicsService],
    exports: [ExtrinsicsService],
})
export class ExtrinsicsModule {}
