import { Inject, NotFoundException } from '@nestjs/common'
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm'
import { BlockchainBountyDto } from '../../../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { BountiesService } from '../../../bounties/bounties.service'
import { BountyEntity } from '../../../bounties/entities/bounty.entity'
import { AppConfig, AppConfigToken } from '../../../config/config.module'
import { CommentsService } from '../../../discussions/comments.service'
import { DiscussionsService } from '../../../discussions/discussions.service'
import { CommentEntity } from '../../../discussions/entites/comment.entity'
import { DiscussionCategory } from '../../../discussions/entites/discussion-category'
import { DiscussionEntity } from '../../../discussions/entites/discussion.entity'
import { getLogger } from '../../../logging.module'
import { UsersService } from '../../../users/users.service'
import { Nil } from '../../../utils/types'
import { AppEventsService } from '../../app-events.service'
import { AppEventType } from '../../entities/app-event-type'
import { NewBountyCommentDto } from './new-bounty-comment.dto'
import { addUserFromWeb3Address, getTaggedUsers } from '../utils'

const logger = getLogger()

@EventSubscriber()
export class BountyCommentSubscriber implements EntitySubscriberInterface<CommentEntity> {
    constructor(
        private readonly commentsService: CommentsService,
        private readonly discussionsService: DiscussionsService,
        private readonly appEventsService: AppEventsService,
        private readonly bountiesService: BountiesService,
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
        if (discussion?.category !== DiscussionCategory.Bounty) {
            return
        }
        logger.info(`Creating NewBountyComment app event: `, entity)

        try {
            const bounty = await this.bountiesService.getBounty(discussion.networkId!, discussion.blockchainIndex!)
            const taggedReceiverIds = await getTaggedUsers(entity)
            const discussionReceiverIds = await this.getReceiverIds(
                entity,
                discussion,
                bounty.blockchain,
                bounty.entity,
                taggedReceiverIds,
            )

            const data = this.getEventDetails(
                entity,
                discussion.blockchainIndex!,
                discussion.networkId!,
                bounty.blockchain,
                bounty.entity,
            )

            await this.appEventsService.create({ ...data, type: AppEventType.TaggedInBountyComment }, taggedReceiverIds)
            await this.appEventsService.create(data, discussionReceiverIds)
        } catch (e) {
            if (e instanceof NotFoundException) {
                logger.info(`Bounty not found, will not create event`, entity)
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
        if (discussion?.category !== DiscussionCategory.Bounty) {
            return
        }

        try {
            const bounty = await this.bountiesService.getBounty(discussion.networkId!, discussion.blockchainIndex!)
            const taggedReceiverIds = await getTaggedUsers(databaseEntity)

            const data = this.getEventDetails(
                databaseEntity,
                discussion.blockchainIndex!,
                discussion.networkId!,
                bounty.blockchain,
                bounty.entity,
            )

            await this.appEventsService.create({ ...data, type: AppEventType.TaggedInBountyComment }, taggedReceiverIds)
        } catch (e) {
            if (e instanceof NotFoundException) {
                logger.info(`Bounty not found, will not create event`, databaseEntity)
            } else {
                throw e
            }
        }
    }

    private getEventDetails(
        comment: CommentEntity,
        blockchainIndex: number,
        networkId: string,
        bountyBlockchain: BlockchainBountyDto,
        bountyEntity: Nil<BountyEntity>,
    ): NewBountyCommentDto {
        const commentsUrl = `${this.appConfig.websiteUrl}/bounties/${blockchainIndex}/discussion?networkId=${networkId}`

        return {
            type: AppEventType.NewBountyComment,
            commentId: comment.id,
            bountyTitle: bountyEntity?.title ?? bountyBlockchain.description,
            bountyBlockchainId: blockchainIndex,
            commentsUrl,
            networkId,
            websiteUrl: this.appConfig.websiteUrl,
        }
    }

    private async getReceiverIds(
        comment: CommentEntity,
        discussion: DiscussionEntity,
        bountyBlockchain: BlockchainBountyDto,
        bountyEntity: Nil<BountyEntity>,
        excludeIds: string[],
    ): Promise<string[]> {
        const receiverIds = (discussion.comments ?? []).map((c) => c.authorId)

        // add bounty in-app owner
        if (bountyEntity) {
            receiverIds.push(bountyEntity.ownerId)
        }

        await addUserFromWeb3Address(this.usersService, bountyBlockchain.proposer, receiverIds)

        if (bountyBlockchain.curator) {
            await addUserFromWeb3Address(this.usersService, bountyBlockchain.curator, receiverIds)
        }

        // Set created from an array will take only distinct values
        const receiversIdsSet = new Set(receiverIds.filter((receiverId) => receiverId !== comment.authorId))

        excludeIds.forEach((id) => {
            receiversIdsSet.delete(id)
        })

        return [...receiversIdsSet]
    }
}
