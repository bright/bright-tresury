import { Inject, NotFoundException } from '@nestjs/common'
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm'
import { getLogger } from '../../../logging.module'
import { CommentEntity } from '../../../discussions/entites/comment.entity'
import { CommentsService } from '../../../discussions/comments.service'
import { DiscussionsService } from '../../../discussions/discussions.service'
import { AppEventsService } from '../../app-events.service'
import { UsersService } from '../../../users/users.service'
import { AppConfig, AppConfigToken } from '../../../config/config.module'
import { DiscussionCategory } from '../../../discussions/entites/discussion-category'
import { AppEventType } from '../../entities/app-event-type'
import { DiscussionEntity } from '../../../discussions/entites/discussion.entity'
import { BlockchainTipDto } from '../../../blockchain/blockchain-tips/dto/blockchain-tip.dto'
import { Nil } from '../../../utils/types'
import { TipEntity } from '../../../tips/tip.entity'
import { NewTipCommentDto } from './new-tip-comment.dto'
import { TipsService } from '../../../tips/tips.service'
import { addUserFromWeb3Address, getTaggedUsers } from '../utils'

const logger = getLogger()

@EventSubscriber()
export class TipCommentSubscriber implements EntitySubscriberInterface<CommentEntity> {
    constructor(
        private readonly commentsService: CommentsService,
        private readonly discussionsService: DiscussionsService,
        private readonly appEventsService: AppEventsService,
        private readonly tipsService: TipsService,
        private readonly usersService: UsersService,
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
        if (discussion?.category !== DiscussionCategory.Tip) {
            return
        }
        logger.info(`Creating NewTipComment app event: `, entity)

        try {
            const tip = await this.tipsService.findOne(discussion.networkId!, discussion.blockchainHash!)

            const taggedReceiverIds = await getTaggedUsers(entity)
            const discussionReceiverIds = await this.getReceiverIds(
                entity,
                discussion,
                tip.blockchain,
                tip.entity,
                taggedReceiverIds,
            )

            const data = this.getEventDetails(
                entity,
                discussion.blockchainHash!,
                discussion.networkId!,
                tip.blockchain,
                tip.entity,
            )

            await this.appEventsService.create({ ...data, type: AppEventType.TaggedInTipComment }, taggedReceiverIds)
            await this.appEventsService.create(data, discussionReceiverIds)
        } catch (e) {
            if (e instanceof NotFoundException) {
                logger.info(`Tip not found, will not create event`, entity)
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

        const discussion = entity.discussion ?? (await this.discussionsService.findOne(databaseEntity.discussionId))
        if (discussion?.category !== DiscussionCategory.Tip) {
            return
        }

        try {
            const tip = await this.tipsService.findOne(discussion.networkId!, discussion.blockchainIndex!)
            const taggedReceiverIds = await getTaggedUsers(databaseEntity)

            const data = this.getEventDetails(
                databaseEntity,
                discussion.blockchainIndex!,
                discussion.networkId!,
                tip.blockchain,
                tip.entity,
            )

            await this.appEventsService.create({ ...data, type: AppEventType.TaggedInTipComment }, taggedReceiverIds)
        } catch (e) {
            if (e instanceof NotFoundException) {
                logger.info(`TIP not found, will not create event`, databaseEntity)
            } else {
                throw e
            }
        }
    }

    private getEventDetails(
        comment: CommentEntity,
        tipHash: string,
        networkId: string,
        tipBlockchain: BlockchainTipDto,
        tipEntity: Nil<TipEntity>,
    ): NewTipCommentDto {
        const commentsUrl = `${this.appConfig.websiteUrl}/tips/${tipHash}/discussion?networkId=${networkId}`

        return {
            type: AppEventType.NewTipComment,
            commentId: comment.id,
            tipTitle: tipEntity?.title ?? tipBlockchain.reason!,
            tipHash,
            commentsUrl,
            networkId,
            websiteUrl: this.appConfig.websiteUrl,
        }
    }

    private async getReceiverIds(
        comment: CommentEntity,
        discussion: DiscussionEntity,
        tipBlockchain: BlockchainTipDto,
        tipEntity: Nil<TipEntity>,
        excludeIds: string[],
    ): Promise<string[]> {
        const receiverIds = (discussion.comments ?? []).map((c) => c.authorId)

        // add tip in-app owner
        if (tipEntity) {
            receiverIds.push(tipEntity.owner.id)
        }

        if (tipBlockchain) {
            await addUserFromWeb3Address(this.usersService, tipBlockchain.finder, receiverIds)
            await addUserFromWeb3Address(this.usersService, tipBlockchain.who, receiverIds)
        }

        // Set created from an array will take only distinct values
        const receiversIdsSet = new Set(receiverIds.filter((receiverId) => receiverId !== comment.authorId))

        excludeIds.forEach((id) => {
            receiversIdsSet.delete(id)
        })

        return [...receiversIdsSet]
    }
}
