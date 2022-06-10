import { Inject, NotFoundException } from '@nestjs/common'
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm'
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
import { ChildBountiesService } from '../../../bounties/child-bounties/child-bounties.service'
import { BlockchainChildBountyDto } from '../../../blockchain/blockchain-child-bounties/dto/blockchain-child-bounty.dto'
import { NewChildBountyCommentDto } from './new-childBounty-comment.dto'
import { ChildBountyEntity } from '../../../bounties/child-bounties/entities/child-bounty.entity'

const logger = getLogger()

@EventSubscriber()
export class ChildBountyCommentSubscriber implements EntitySubscriberInterface<CommentEntity> {
    constructor(
        private readonly commentsService: CommentsService,
        private readonly discussionsService: DiscussionsService,
        private readonly appEventsService: AppEventsService,
        private readonly childBountiesService: ChildBountiesService,
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
        if (discussion?.category !== DiscussionCategory.ChildBounty) {
            return
        }
        logger.info(`Creating NewChildBountyComment app event: `, entity)

        try {
            const childBounty = await this.childBountiesService.findOne(discussion.networkId!, {
                parentBountyBlockchainIndex: Number(discussion.parentBountyBlockchainIndex),
                blockchainIndex: discussion.blockchainIndex!,
            })

            const taggedReceiverIds = await this.getTaggedUsers(entity)
            const discussionReceiverIds = await this.getReceiverIds(
                entity,
                discussion,
                childBounty.blockchain,
                childBounty.entity,
                taggedReceiverIds,
            )

            const data = this.getEventDetails(
                entity,
                discussion.blockchainIndex!,
                discussion.networkId!,
                childBounty.blockchain,
                childBounty.entity,
            )

            await this.appEventsService.create(
                { ...data, type: AppEventType.TaggedInChildBountyComment },
                taggedReceiverIds,
            )
            await this.appEventsService.create(data, discussionReceiverIds)
        } catch (e) {
            if (e instanceof NotFoundException) {
                logger.info(`Child bounty not found, will not create event`, entity)
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
        if (discussion?.category !== DiscussionCategory.ChildBounty) {
            return
        }

        try {
            const childBounty = await this.childBountiesService.findOne(discussion.networkId!, {
                parentBountyBlockchainIndex: discussion.parentBountyBlockchainIndex,
                blockchainIndex: discussion.blockchainIndex,
            })
            const taggedReceiverIds = await this.getTaggedUsers(databaseEntity)

            const data = this.getEventDetails(
                databaseEntity,
                discussion.blockchainIndex!,
                discussion.networkId!,
                childBounty.blockchain,
                childBounty.entity,
            )

            await this.appEventsService.create(
                { ...data, type: AppEventType.TaggedInChildBountyComment },
                taggedReceiverIds,
            )
        } catch (e) {
            if (e instanceof NotFoundException) {
                logger.info(`Child Bounty not found, will not create event`, databaseEntity)
            } else {
                throw e
            }
        }
    }

    private async getTaggedUsers(comment: CommentEntity): Promise<string[]> {
        const taggedUsers: string[] = []

        const commentContainsTag = comment.content.match(/\[(?<text>.+)\]\((?<url>[^ ]+)(?: "(?<title>.+)")?\)/gim)

        if (commentContainsTag) {
            const userId = commentContainsTag[0].match(/(?<=\().+?(?=\))/gim)
            if (userId !== null) {
                for (const id of userId) {
                    taggedUsers.push(id)
                }
            }
        }

        return [...new Set(taggedUsers)]
    }

    private getEventDetails(
        comment: CommentEntity,
        blockchainIndex: number,
        networkId: string,
        childBountyBlockchain: BlockchainChildBountyDto,
        childBountyEntity: Nil<ChildBountyEntity>,
    ): NewChildBountyCommentDto {
        const commentsUrl = `${this.appConfig.websiteUrl}/bounties/${childBountyBlockchain.parentIndex}/child-bounties/${blockchainIndex}/discussion?networkId=${networkId}`

        return {
            type: AppEventType.NewChildBountyComment,
            commentId: comment.id,
            childBountyTitle: childBountyEntity?.title ?? childBountyBlockchain.description,
            childBountyBlockchainId: blockchainIndex,
            bountyBlockchainId: childBountyBlockchain.parentIndex,
            commentsUrl,
            networkId,
            websiteUrl: this.appConfig.websiteUrl,
        }
    }

    private async getReceiverIds(
        comment: CommentEntity,
        discussion: DiscussionEntity,
        childBountyBlockchain: BlockchainChildBountyDto,
        childBountyEntity: Nil<ChildBountyEntity>,
        excludeIds: string[],
    ): Promise<string[]> {
        const receiverIds = (discussion.comments ?? []).map((c) => c.authorId)

        // add bounty in-app owner
        if (childBountyEntity) {
            receiverIds.push(childBountyEntity.ownerId)
        }

        await this.addUserFromWeb3Address(childBountyBlockchain.beneficiary!, receiverIds)

        if (childBountyBlockchain.curator) {
            await this.addUserFromWeb3Address(childBountyBlockchain.curator, receiverIds)
        }

        // Set created from an array will take only distinct values
        const receiversIdsSet = new Set(receiverIds.filter((receiverId) => receiverId !== comment.authorId))

        excludeIds.forEach((id) => {
            receiversIdsSet.delete(id)
        })

        return [...receiversIdsSet]
    }

    private async addUserFromWeb3Address(web3address: string, receiverIds: string[]): Promise<void> {
        try {
            const user = await this.usersService.findOneByWeb3AddressOrThrow(web3address)
            receiverIds.push(user.id)
        } catch (err) {
            logger.info(`No user with address ${web3address} found`)
        }
    }
}
