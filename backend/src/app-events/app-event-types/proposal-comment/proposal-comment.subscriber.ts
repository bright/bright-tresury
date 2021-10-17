import { Inject } from '@nestjs/common'
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm'
import { AppConfig, AppConfigToken } from '../../../config/config.module'
import { getLogger } from '../../../logging.module'
import { BlockchainProposalWithDomainDetails } from '../../../proposals/dto/blockchain-proposal-with-domain-details.dto'
import { ProposalComment } from '../../../proposals/proposal-comments/entities/proposal-comment.entity'
import { ProposalCommentsService } from '../../../proposals/proposal-comments/proposal-comments.service'
import { ProposalsService } from '../../../proposals/proposals.service'
import { UsersService } from '../../../users/users.service'
import { AppEventsService } from '../../app-events.service'
import { AppEventType } from '../../entities/app-event-type'
import { NewProposalCommentDto } from './new-proposal-comment.dto'

const logger = getLogger()

@EventSubscriber()
export class ProposalCommentSubscriber implements EntitySubscriberInterface<ProposalComment> {
    constructor(
        private readonly commentsService: ProposalCommentsService,
        private readonly appEventsService: AppEventsService,
        private readonly proposalsService: ProposalsService,
        private readonly usersService: UsersService,
        @Inject(AppConfigToken) private readonly appConfig: AppConfig,
        connection: Connection,
    ) {
        connection.subscribers.push(this)
    }

    listenTo() {
        return ProposalComment
    }

    async afterInsert({ entity }: InsertEvent<ProposalComment>) {
        logger.info(`New proposal comment created. Creating NewProposalComment app event: `, entity)

        const proposal = await this.proposalsService.findOne(entity.blockchainProposalId, entity.networkId)
        const receiverIds = await this.getReceiverIds(entity, proposal)
        const data = this.getEventDetails(entity, proposal)

        await this.appEventsService.create(data, receiverIds)
    }

    private getEventDetails(
        proposalComment: ProposalComment,
        proposal: BlockchainProposalWithDomainDetails,
    ): NewProposalCommentDto {
        const commentsUrl = `${this.appConfig.websiteUrl}/proposals/${proposalComment.blockchainProposalId}/discussion?networkId=${proposalComment.networkId}`

        return {
            type: AppEventType.NewProposalComment,
            commentId: proposalComment.comment.id,
            proposalTitle: proposal.entity?.details.title ?? '',
            proposalBlockchainId: proposalComment.blockchainProposalId,
            commentsUrl,
            networkId: proposalComment.networkId,
            websiteUrl: this.appConfig.websiteUrl,
        }
    }

    private async getReceiverIds(
        proposalComment: ProposalComment,
        proposal: BlockchainProposalWithDomainDetails,
    ): Promise<string[]> {
        const receiverIds = (
            await this.commentsService.findAll(proposalComment.blockchainProposalId, proposalComment.networkId)
        ).map((c) => c.comment.authorId)

        // add idea owner
        if (proposal.entity) {
            const ownerId = receiverIds.push(proposal.entity.ownerId)
        }

        // add proposer
        try {
            const proposerUser = await this.usersService.findOneByWeb3Address(proposal.blockchain.proposer.address)
            receiverIds.push(proposerUser.id)
        } catch (err) {
            logger.info('No user with proposer address found')
        }

        // Set created from an array will take only distinct values
        return [...new Set(receiverIds)].filter((receiverId) => receiverId !== proposalComment.comment.authorId)
    }
}
