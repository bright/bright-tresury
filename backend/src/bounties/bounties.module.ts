import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from '../auth/session/session.module'
import { CommentEntity } from '../comments/comment.entity'
import { ExtrinsicsModule } from '../extrinsics/extrinsics.module'
import { BountiesController } from './bounties.controller'
import { BountiesService } from './bounties.service'
import { BountyCommentsController } from './bounty-comments/bounty-comments.controller'
import { BountyCommentsService } from './bounty-comments/bounty-comments.service'
import { BountyCommentEntity } from './bounty-comments/entities/bounty-comment.entity'
import { BountyEntity } from './entities/bounty.entity'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { PolkassemblyModule } from '../polkassembly/polkassembly.module'
import { UsersModule } from '../users/users.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([BountyEntity, BountyCommentEntity, CommentEntity]),
        SessionModule,
        ExtrinsicsModule,
        BlockchainModule,
        PolkassemblyModule,
        UsersModule,
    ],
    controllers: [BountiesController, BountyCommentsController],
    providers: [BountiesService, BountyCommentsService],
    exports: [BountyCommentsService, BountiesService],
})
export class BountiesModule {}
