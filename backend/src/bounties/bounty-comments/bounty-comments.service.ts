import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CommentEntity } from '../../comments/comment.entity'
import { CreateCommentDto } from '../../comments/dto/create-comment.dto'
import { UpdateCommentDto } from '../../comments/dto/update-comment.dto'
import { UserEntity } from '../../users/entities/user.entity'
import { BountiesService } from '../bounties.service'
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

    async findAll(blockchainBountyId: number, networkId: string): Promise<BountyCommentEntity[]> {
        await this.bountiesService.getBounty(networkId, blockchainBountyId)
        return this.bountyCommentsRepository.find({
            where: { blockchainBountyId, networkId },
            relations: ['comment', 'comment.author', 'comment.author.web3Addresses'],
        })
    }

    async findOne(blockchainBountyId: number, networkId: string, commentId: string): Promise<BountyCommentEntity> {
        await this.bountiesService.getBounty(networkId, blockchainBountyId)
        const comment = await this.bountyCommentsRepository.findOne({
            where: { blockchainBountyId, networkId, comment: { id: commentId } },
            relations: ['comment', 'comment.author', 'comment.author.web3Addresses'],
        })
        if (!comment) {
            throw new NotFoundException('The given comment id does not exist')
        }
        return comment
    }

    async create(
        blockchainBountyId: number,
        networkId: string,
        { content }: CreateCommentDto,
        author: UserEntity,
    ): Promise<BountyCommentEntity> {
        await this.bountiesService.getBounty(networkId, blockchainBountyId)
        const comment = await this.commentsRepository.save(this.commentsRepository.create({ author, content }))
        return this.bountyCommentsRepository.save(
            this.bountyCommentsRepository.create({ comment, blockchainBountyId, networkId }),
        )
    }

    async update(
        blockchainBountyId: number,
        networkId: string,
        bountyCommentId: string,
        { content }: UpdateCommentDto,
        user: UserEntity,
    ): Promise<BountyCommentEntity> {
        const bountyComment = await this.findOne(blockchainBountyId, networkId, bountyCommentId)
        bountyComment.canEditOrThrow(user)

        bountyComment.comment.content = content
        await this.commentsRepository.save(bountyComment.comment)

        return bountyComment
    }

    async delete(blockchainBountyId: number, networkId: string, commentId: string, user: UserEntity): Promise<void> {
        const bountyComment = await this.findOne(blockchainBountyId, networkId, commentId)
        bountyComment.canEditOrThrow(user)

        // we can remove the commentEntity due to the cascade rule
        await this.commentsRepository.remove(bountyComment.comment)
    }
}
