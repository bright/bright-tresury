import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from '../auth/session/session.module'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'
import { DiscussionsService } from './discussions.service'
import { CommentEntity } from './entites/comment.entity'
import { DiscussionEntity } from './entites/discussion.entity'
import { CommentReactionsController } from './reactions/comment-reactions.controller'
import { CommentReactionsService } from './reactions/comment-reactions.service'
import { CommentReactionEntity } from './reactions/entities/comment-reaction.entity'

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntity, DiscussionEntity, CommentReactionEntity]), SessionModule],
    controllers: [CommentsController, CommentReactionsController],
    providers: [DiscussionsService, CommentsService, CommentReactionsService],
    exports: [DiscussionsService, CommentsService],
})
export class DiscussionsModule {}
