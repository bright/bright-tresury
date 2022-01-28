import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../../users/entities/user.entity'
import { CommentEntity } from '../../comments/comment.entity'
import { ProposalsService } from '../proposals.service'
import { ProposalCommentEntity } from './entities/proposal-comment.entity'
import { UpdateCommentDto } from '../../comments/dto/update-comment.dto'
import { CreateCommentDto } from '../../comments/dto/create-comment.dto'

@Injectable()
export class ProposalCommentsService {
    constructor(
        @InjectRepository(ProposalCommentEntity)
        private readonly proposalCommentsRepository: Repository<ProposalCommentEntity>,
        @InjectRepository(CommentEntity)
        private readonly commentsRepository: Repository<CommentEntity>,
        private readonly proposalsService: ProposalsService,
    ) {}

    async findOne(commentId: string): Promise<ProposalCommentEntity> {
        const proposalComment = await this.proposalCommentsRepository.findOne({
            relations: ['comment', 'comment.author', 'comment.author.web3Addresses'],
            where: { comment: { id: commentId } },
        })
        if (!proposalComment) throw new NotFoundException(`ProposalComment not found - commentId: ${commentId}`)

        return proposalComment
    }

    async findAll(blockchainProposalId: number, networkId: string): Promise<ProposalCommentEntity[]> {
        return this.proposalCommentsRepository.find({
            where: { blockchainProposalId, networkId },
            relations: ['comment', 'comment.author', 'comment.author.web3Addresses'],
        })
    }

    async create(
        blockchainProposalId: number,
        networkId: string,
        author: UserEntity,
        dto: CreateCommentDto,
    ): Promise<ProposalCommentEntity> {
        // check if proposal exists (proposalService.findOne will throw exception if proposal does not exist
        await this.proposalsService.findOne(blockchainProposalId, networkId)
        const comment = await this.commentsRepository.save(new CommentEntity(author, dto.content))
        return this.proposalCommentsRepository.save(new ProposalCommentEntity(blockchainProposalId, networkId, comment))
    }

    async update(
        blockchainProposalId: number,
        networkId: string,
        commentId: string,
        dto: UpdateCommentDto,
        user: UserEntity,
    ): Promise<ProposalCommentEntity> {
        // check if proposal exists (proposalService.findOne will throw exception if proposal does not exist
        await this.proposalsService.findOne(blockchainProposalId, networkId)
        const proposalComment = await this.findOne(commentId)
        proposalComment.canEditOrThrow(user)
        await this.commentsRepository.save({
            ...proposalComment.comment,
            content: dto.content,
        })
        return await this.findOne(commentId)
    }

    async delete(blockchainProposalId: number, commentId: string, user: UserEntity) {
        const proposalComment = await this.findOne(commentId)
        if (proposalComment.blockchainProposalId !== blockchainProposalId) {
            throw new NotFoundException('Comment does not belong to the proposal')
        }
        proposalComment.canEditOrThrow(user)
        // its ok to remove from commentsRepository only because the proposal will be auto removed because of the cascade rule
        await this.commentsRepository.remove(proposalComment.comment)
        return proposalComment
    }
}
