import { Inject } from '@nestjs/common'
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm'
import { BlockchainBountyDto } from '../../../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { BountiesService } from '../../../bounties/bounties.service'
import { BountyCommentsService } from '../../../bounties/bounty-comments/bounty-comments.service'
import { BountyCommentEntity } from '../../../bounties/bounty-comments/entities/bounty-comment.entity'
import { BountyEntity } from '../../../bounties/entities/bounty.entity'
import { AppConfig, AppConfigToken } from '../../../config/config.module'
import { getLogger } from '../../../logging.module'
import { UsersService } from '../../../users/users.service'
import { Nil } from '../../../utils/types'
import { AppEventsService } from '../../app-events.service'
import { AppEventType } from '../../entities/app-event-type'
import { NewBountyCommentDto } from './new-bounty-comment.dto'

const logger = getLogger()

@EventSubscriber()
export class BountyCommentSubscriber implements EntitySubscriberInterface<BountyCommentEntity> {
    constructor(
        private readonly commentsService: BountyCommentsService,
        private readonly appEventsService: AppEventsService,
        private readonly bountiesService: BountiesService,
        private readonly usersService: UsersService,
        @Inject(AppConfigToken) private readonly appConfig: AppConfig,
        connection: Connection,
    ) {
        connection.subscribers.push(this)
    }

    listenTo() {
        return BountyCommentEntity
    }

    async afterInsert({ entity }: InsertEvent<BountyCommentEntity>) {
        logger.info(`New bounty comment created. Creating NewBountyComment app event: `, entity)

        const [bountyBlockchain, bountyEntity] = await this.bountiesService.getBounty(
            entity.networkId,
            entity.blockchainBountyId,
        )
        const receiverIds = await this.getReceiverIds(entity, bountyBlockchain, bountyEntity)
        const data = this.getEventDetails(entity, bountyBlockchain, bountyEntity)

        await this.appEventsService.create(data, receiverIds)
    }

    private getEventDetails(
        bountyComment: BountyCommentEntity,
        bountyBlockchain: BlockchainBountyDto,
        bountyEntity: Nil<BountyEntity>,
    ): NewBountyCommentDto {
        const commentsUrl = `${this.appConfig.websiteUrl}/bounties/${bountyComment.blockchainBountyId}/discussion?networkId=${bountyComment.networkId}`

        return {
            type: AppEventType.NewBountyComment,
            commentId: bountyComment.comment.id,
            bountyTitle: bountyEntity?.title ?? bountyBlockchain.description,
            bountyBlockchainId: bountyComment.blockchainBountyId,
            commentsUrl,
            networkId: bountyComment.networkId,
            websiteUrl: this.appConfig.websiteUrl,
        }
    }

    private async getReceiverIds(
        bountyComment: BountyCommentEntity,
        bountyBlockchain: BlockchainBountyDto,
        bountyEntity: Nil<BountyEntity>,
    ): Promise<string[]> {
        const receiverIds = (
            await this.commentsService.findAll(bountyComment.blockchainBountyId, bountyComment.networkId)
        ).map((c) => c.comment.authorId)

        // add bounty in-app owner
        if (bountyEntity) {
            receiverIds.push(bountyEntity.ownerId)
        }

        await this.addUserFromWeb3Address(bountyBlockchain.proposer.address, receiverIds)

        if (bountyBlockchain.curator) {
            await this.addUserFromWeb3Address(bountyBlockchain.curator.address, receiverIds)
        }

        // Set created from an array will take only distinct values
        return [...new Set(receiverIds)].filter((receiverId) => receiverId !== bountyComment.comment.authorId)
    }

    private async addUserFromWeb3Address(web3address: string, receiverIds: string[]): Promise<void> {
        try {
            const user = await this.usersService.findOneByWeb3Address(web3address)
            receiverIds.push(user.id)
        } catch (err) {
            logger.info(`No user with address ${web3address} found`)
        }
    }
}
