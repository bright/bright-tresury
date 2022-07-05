import { Inject, NotFoundException } from '@nestjs/common'
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm'
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
import { getTaggedUsers } from '../utils'

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
            const taggedReceiverIds = await getTaggedUsers(entity)
            const discussionReceiverIds = await this.getReceiverIds(entity, discussion, idea, taggedReceiverIds)
            const data = this.getEventDetails(entity, idea)

            await this.appEventsService.create({ ...data, type: AppEventType.TaggedInIdeaComment }, taggedReceiverIds)
            await this.appEventsService.create(data, discussionReceiverIds)
        } catch (e) {
            if (e instanceof NotFoundException) {
                logger.info(`Idea not found, will not create event`, entity)
            } else {
                throw e
            }
        }
    }

    async afterUpdate({ databaseEntity, entity }: UpdateEvent<CommentEntity>) {
        logger.info(`Comment updated: `, entity)

        if (entity && 'content' in entity) {
            databaseEntity.content = entity.content
        } else {
            return
        }

        const discussion =
            databaseEntity.discussion ?? (await this.discussionsService.findOne(databaseEntity.discussionId))
        if (discussion?.category !== DiscussionCategory.Idea) {
            return
        }

        try {
            const { entity: idea } = await this.ideasService.findOne(discussion.entityId!)
            const taggedReceiverIds = await getTaggedUsers(databaseEntity)
            const data = this.getEventDetails(databaseEntity, idea)

            await this.appEventsService.create({ ...data, type: AppEventType.TaggedInIdeaComment }, taggedReceiverIds)
        } catch (e) {
            if (e instanceof NotFoundException) {
                logger.info(`Idea not found, will not create event`, databaseEntity)
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
        excludeIds: string[],
    ): Promise<string[]> {
        const allAuthorIds = (discussion.comments ?? []).map((c) => c.authorId)
        allAuthorIds.push(idea.ownerId)

        // Set created from an array will take only distinct values
        const receiversIdsSet = new Set(allAuthorIds.filter((receiverId) => receiverId !== comment.authorId))

        excludeIds.forEach((id) => {
            receiversIdsSet.delete(id)
        })
        return [...receiversIdsSet]
    }
}
