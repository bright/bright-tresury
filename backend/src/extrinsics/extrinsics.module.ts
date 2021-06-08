import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { DatabaseModule } from '../database/database.module'
import { Extrinsic } from './extrinsic.entity'
import { ExtrinsicsService } from './extrinsics.service'

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([Extrinsic]), BlockchainModule],
    providers: [ExtrinsicsService],
    exports: [ExtrinsicsService],
})
export class ExtrinsicsModule {}
