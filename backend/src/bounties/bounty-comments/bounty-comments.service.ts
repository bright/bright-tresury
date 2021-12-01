import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CommentEntity } from '../../comments/comment.entity'
import { UserEntity } from '../../users/user.entity'
import { BountiesService } from '../bounties.service'
import { CreateBountyCommentDto } from './dto/create-bounty-comment.dto'
import { BountyCommentEntity } from './entities/bounty-comment.entity'

@Injectable()
export class BountyCommentsService {
    constructor(
        @InjectRepository(BountyCommentEntity)
        private readonly bountyCommentsRepository: Repository<BountyCommentEntity>,
        @InjectRepository(CommentEntity)
        private readonly commentsRepository: Repository<CommentEntity>,
        private readonly bountiesService: BountiesService,
    ) {}

    async getAll(blockchainBountyId: number, networkId: string): Promise<BountyCommentEntity[]> {
        await this.bountiesService.getBounty(networkId, blockchainBountyId)
        return this.bountyCommentsRepository.find({
            where: { blockchainBountyId, networkId },
            relations: ['comment', 'comment.author', 'comment.author.web3Addresses'],
        })
    }

    async create(
        blockchainBountyId: number,
        { content, networkId }: CreateBountyCommentDto,
        author: UserEntity,
    ): Promise<BountyCommentEntity> {
        await this.bountiesService.getBounty(networkId, blockchainBountyId)
        const comment = await this.commentsRepository.save(this.commentsRepository.create({ author, content }))
        return this.bountyCommentsRepository.save(
            this.bountyCommentsRepository.create({ comment, blockchainBountyId, networkId }),
        )
    }
}
