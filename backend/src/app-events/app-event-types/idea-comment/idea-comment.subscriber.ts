import { Inject, NotFoundException } from '@nestjs/common'
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm'
import { AppConfig, AppConfigToken } from '../../../config/config.module'
import { CommentsService } from '../../../discussions/comments.service'
import { DiscussionsService } from '../../../discussions/discussions.service'
import { CommentEntity } from '../../../discussions/entites/comment.entity'
import { DiscussionCategory } from '../../../discussions/entites/discussion-category'
import { DiscussionEntity } from '../../../discussions/entites/discussion.entity'
import { IdeaEntity } from '../../../ideas/entities/idea.entity'
import { IdeasService } from '../../../ideas/ideas.service'
import { getLogger } from '../../../logging.module'
import { AppEventsService } from '../../app-events.service'
import { AppEventType } from '../../entities/app-event-type'
import { NewIdeaCommentDto } from './new-idea-comment.dto'

const logger = getLogger()

@EventSubscriber()
export class IdeaCommentSubscriber implements EntitySubscriberInterface<CommentEntity> {
    constructor(
        private readonly commentsService: CommentsService,
        private readonly discussionsService: DiscussionsService,
        private readonly appEventsService: AppEventsService,
        private readonly ideasService: IdeasService,
        @Inject(AppConfigToken) private readonly appConfig: AppConfig,
        connection: Connection,
    ) {
        connection.subscribers.push(this)
    }

    listenTo() {
        return CommentEntity
    }

    async afterInsert({ entity }: InsertEvent<CommentEntity>) {
        logger.info(`New comment created:`, entity)

        const discussion = entity.discussion ?? (await this.discussionsService.findOne(entity.discussionId))
        if (discussion?.category !== DiscussionCategory.Idea) {
            return
        }
        logger.info(`Creating NewIdeaComment app event: `, entity)

        try {
            const { entity: idea } = await this.ideasService.findOne(discussion.entityId!)
            const receiverIds = await this.getReceiverIds(entity, discussion, idea)
            const data = this.getEventDetails(entity, idea)

            await this.appEventsService.create(data, receiverIds)
        } catch (e) {
            if (e instanceof NotFoundException) {
                logger.info(`Idea not found, will not create event`, entity)
            } else {
                throw e
            }
        }
    }

    private getEventDetails(comment: CommentEntity, idea: IdeaEntity): NewIdeaCommentDto {
        const networkId = idea.networks[0]?.name
        const networkQueryParam = networkId ? `networkId=${networkId}` : ''
        const commentsUrl = `${this.appConfig.websiteUrl}/ideas/${idea.id}/discussion?${networkQueryParam}`

        return {
            type: AppEventType.NewIdeaComment,
            commentId: comment.id,
            ideaOrdinalNumber: idea.ordinalNumber,
            ideaTitle: idea.details.title,
            ideaId: idea.id,
            commentsUrl,
            networkIds: idea.networks.map((n) => n.name),
            websiteUrl: this.appConfig.websiteUrl,
        }
    }

    private async getReceiverIds(
        comment: CommentEntity,
        discussion: DiscussionEntity,
        idea: IdeaEntity,
    ): Promise<string[]> {
        const allAuthorIds = (discussion.comments ?? []).map((c) => c.authorId)

        // Set created from an array will take only distinct values
        const receiverIds = [...new Set(allAuthorIds), idea.ownerId].filter(
            (receiverId) => receiverId !== comment.authorId,
        )
        return receiverIds
    }
}
