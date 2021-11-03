import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from '../auth/session/session.module'
import { ExtrinsicsModule } from '../extrinsics/extrinsics.module'
import { BountiesController } from './bounties.controller'
import { BountiesService } from './bounties.service'
import { BountyEntity } from './entities/bounty.entity'

@Module({
    imports: [TypeOrmModule.forFeature([BountyEntity]), SessionModule, ExtrinsicsModule],
    controllers: [BountiesController],
    providers: [BountiesService],
})
export class BountiesModule {}
