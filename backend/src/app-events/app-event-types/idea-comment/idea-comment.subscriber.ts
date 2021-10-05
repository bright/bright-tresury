import { Inject } from '@nestjs/common'
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm'
import { Idea } from '../../../ideas/entities/idea.entity'
import { AppEventsService } from '../../app-events.service'
import { AppEventType } from '../../entities/app-event-type'
import { AppConfig, AppConfigToken } from '../../../config/config.module'
import { IdeasService } from '../../../ideas/ideas.service'
import { IdeaComment } from '../../../ideas/idea-comments/entities/idea-comment.entity'
import { getLogger } from '../../../logging.module'
import { IdeaCommentsService } from '../../../ideas/idea-comments/idea-comments.service'
import { NewIdeaCommentDto } from './new-idea-comment.dto'

const logger = getLogger()

@EventSubscriber()
export class IdeaCommentSubscriber implements EntitySubscriberInterface<IdeaComment> {
    constructor(
        private readonly commentsService: IdeaCommentsService,
        private readonly appEventsService: AppEventsService,
        private readonly ideasService: IdeasService,
        @Inject(AppConfigToken) private readonly appConfig: AppConfig,
        connection: Connection,
    ) {
        connection.subscribers.push(this)
    }

    listenTo() {
        return IdeaComment
    }

    async afterInsert({ entity }: InsertEvent<IdeaComment>) {
        logger.info(`New idea comment created. Creating NewIdeaComment app event: `, entity)

        const idea = entity.idea ?? (await this.ideasService.findOne(entity.ideaId))
        const receiverIds = await this.getReceiverIds(entity, idea)
        const data = this.getEventDetails(entity, idea)

        await this.appEventsService.create(data, receiverIds)
    }

    private getEventDetails(ideaComment: IdeaComment, idea: Idea): NewIdeaCommentDto {
        const networkId = idea.networks[0]?.name
        const networkQueryParam = networkId ? `networkId=${networkId}` : ''
        const commentsUrl = `${this.appConfig.websiteUrl}/ideas/${idea.id}/discussion?${networkQueryParam}`

        return {
            type: AppEventType.NewIdeaComment,
            commentId: ideaComment.comment.id,
            ideaOrdinalNumber: idea.ordinalNumber,
            ideaTitle: idea.details.title,
            ideaId: idea.id,
            commentsUrl,
            networkIds: idea.networks.map((n) => n.name),
        }
    }

    private async getReceiverIds(ideaComment: IdeaComment, idea: Idea): Promise<string[]> {
        const allAuthorIds = (await this.commentsService.findAll(idea.id)).map((c) => c.comment.authorId)

        // Set created from an array will take only distinct values
        const receiverIds = [...new Set(allAuthorIds), idea.ownerId].filter(
            (receiverId) => receiverId !== ideaComment.comment.authorId,
        )
        return receiverIds
    }
}
