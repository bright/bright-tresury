import { Inject, NotFoundException } from '@nestjs/common'
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm'
import { AppConfig, AppConfigToken } from '../../../config/config.module'
import { CommentsService } from '../../../discussions/comments.service'
import { DiscussionsService } from '../../../discussions/discussions.service'
import { CommentEntity } from '../../../discussions/entites/comment.entity'
import { DiscussionCategory } from '../../../discussions/entites/discussion-category'
import { DiscussionEntity } from '../../../discussions/entites/discussion.entity'
import { getLogger } from '../../../logging.module'
import { BlockchainProposalWithDomainDetails } from '../../../proposals/dto/blockchain-proposal-with-domain-details.dto'
import { ProposalsService } from '../../../proposals/proposals.service'
import { UsersService } from '../../../users/users.service'
import { AppEventsService } from '../../app-events.service'
import { AppEventType } from '../../entities/app-event-type'
import { NewProposalCommentDto } from './new-proposal-comment.dto'

const logger = getLogger()

@EventSubscriber()
export class ProposalCommentSubscriber implements EntitySubscriberInterface<CommentEntity> {
    constructor(
        private readonly commentsService: CommentsService,
        private readonly discussionsService: DiscussionsService,
        private readonly appEventsService: AppEventsService,
        private readonly proposalsService: ProposalsService,
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
        if (discussion?.category !== DiscussionCategory.Proposal) {
            return
        }
        logger.info(`Creating NewProposalComment app event: `, entity)

        try {
            const proposal = await this.proposalsService.findOne(discussion.blockchainIndex!, discussion.networkId!)
            const receiverIds = await this.getReceiverIds(entity, discussion, proposal)
            const data = this.getEventDetails(entity, discussion.blockchainIndex!, discussion.networkId!, proposal)

            await this.appEventsService.create(data, receiverIds)
        } catch (e) {
            if (e instanceof NotFoundException) {
                logger.info(`Proposal not found, will not create event`, entity)
            } else {
                throw e
            }
        }
    }

    private getEventDetails(
        comment: CommentEntity,
        blockchainIndex: number,
        networkId: string,
        proposal: BlockchainProposalWithDomainDetails,
    ): NewProposalCommentDto {
        const commentsUrl = `${this.appConfig.websiteUrl}/proposals/${blockchainIndex}/discussion?networkId=${networkId}`

        return {
            type: AppEventType.NewProposalComment,
            commentId: comment.id,
            proposalTitle: proposal.entity?.details.title ?? '',
            proposalBlockchainId: blockchainIndex,
            commentsUrl,
            networkId,
            websiteUrl: this.appConfig.websiteUrl,
        }
    }

    private async getReceiverIds(
        comment: CommentEntity,
        discussion: DiscussionEntity,
        proposal: BlockchainProposalWithDomainDetails,
    ): Promise<string[]> {
        const receiverIds = (discussion.comments ?? []).map((c) => c.authorId)

        // add idea owner
        if (proposal.entity) {
            receiverIds.push(proposal.entity.ownerId)
        }

        // add proposer
        try {
            const proposerUser = await this.usersService.findOneByWeb3Address(proposal.blockchain.proposer.address)
            receiverIds.push(proposerUser.id)
        } catch (err) {
            logger.info('No user with proposer address found')
        }

        // Set created from an array will take only distinct values
        return [...new Set(receiverIds)].filter((receiverId) => receiverId !== comment.authorId)
    }
}
