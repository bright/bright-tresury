import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from '../auth/session/session.module'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'
import { DiscussionsService } from './discussions.service'
import { CommentEntity } from './entites/comment.entity'
import { DiscussionEntity } from './entites/discussion.entity'

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntity, DiscussionEntity]), SessionModule],
    controllers: [CommentsController],
    providers: [DiscussionsService, CommentsService],
    exports: [DiscussionsService, CommentsService],
})
export class DiscussionsModule {}
