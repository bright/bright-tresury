import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { SessionData } from '../../auth/session/session.decorator'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { ProposalCommentEntity } from './entities/proposal-comment.entity'
import { mockedBlockchainService, mockGetProposalAndGetProposals } from '../spec.helpers'
import { createUserSessionHandlerWithVerifiedEmail } from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { NETWORKS } from '../../utils/spec.helpers'
const { POLKADOT } = NETWORKS
import { ProposalCommentsService } from './proposal-comments.service'
import { BlockchainProposal } from '../../blockchain/dto/blockchain-proposal.dto'
import { UserEntity } from '../../users/user.entity'

describe('ProposalCommentsServiceSpec', () => {
    const app = beforeSetupFullApp()
    const getBlockchainService = () => app.get().get(BlockchainService)
    const getProposalCommentsService = () => app.get().get(ProposalCommentsService)

    const getRepository = beforeAllSetup(() =>
        app().get<Repository<ProposalCommentEntity>>(getRepositoryToken(ProposalCommentEntity)),
    )
    let usr1SessionData: SessionData
    let proposals: BlockchainProposal[]
    let proposal: BlockchainProposal

    beforeAll(() => {
        mockGetProposalAndGetProposals(app().get(BlockchainService))
    })

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        usr1SessionData = (await createUserSessionHandlerWithVerifiedEmail(app())).sessionData
        proposals = await getBlockchainService().getProposals(POLKADOT)
        proposal = proposals[0]
    })

    describe('create proposal comment', () => {
        it('should create comment for existing proposal', async () => {
            const createdComment = await getProposalCommentsService().create(
                proposal.proposalIndex,
                POLKADOT,
                usr1SessionData.user,
                {
                    content: 'This is a comment',
                },
            )
            const savedProposalComment = (await getRepository().findOne(createdComment.id, { relations: ['comment'] }))!
            const { comment } = savedProposalComment
            expect(comment.content).toBe('This is a comment')
        })
        it('should throw NotFoundException when creating a comment for non existing proposal', async () => {
            await expect(
                getProposalCommentsService().create(1000000, POLKADOT, usr1SessionData.user, {
                    content: 'This is a comment',
                }),
            ).rejects.toThrow(NotFoundException)
        })
    })

    describe('get proposal comment(s)', () => {
        it('should return saved comment', async () => {
            const createdProposalComment = await getProposalCommentsService().create(
                proposal.proposalIndex,
                POLKADOT,
                usr1SessionData.user,
                {
                    content: 'This is a comment',
                },
            )
            const foundProposalComment = await getProposalCommentsService().findOne(createdProposalComment.comment.id)
            expect(foundProposalComment.id).toBe(createdProposalComment.id)
            expect(foundProposalComment.blockchainProposalId).toEqual(createdProposalComment.blockchainProposalId)
            expect(foundProposalComment.networkId).toEqual(createdProposalComment.networkId)
            expect(foundProposalComment.comment.id).toEqual(createdProposalComment.comment.id)
            expect(foundProposalComment.comment.content).toEqual(createdProposalComment.comment.content)
        })
        it('should return saved comments', async () => {
            const createdComment = await getProposalCommentsService().create(
                proposal.proposalIndex,
                POLKADOT,
                usr1SessionData.user,
                {
                    content: 'This is a comment',
                },
            )
            const foundProposalComments = await getProposalCommentsService().findAll(proposal.proposalIndex, POLKADOT)

            expect(Array.isArray(foundProposalComments)).toBe(true)
            expect(foundProposalComments).toHaveLength(1)

            const [foundProposalComment] = foundProposalComments
            expect(foundProposalComment.id).toBe(createdComment.id)
            expect(foundProposalComment.blockchainProposalId).toEqual(createdComment.blockchainProposalId)
            expect(foundProposalComment.networkId).toEqual(createdComment.networkId)
            expect(foundProposalComment.comment.id).toEqual(createdComment.comment.id)
            expect(foundProposalComment.comment.createdAt.getTime()).toBe(createdComment.comment.createdAt.getTime())
            expect(foundProposalComment.comment.content).toEqual(createdComment.comment.content)
            expect(foundProposalComment.comment.content).toBe(createdComment.comment.content)
            expect(foundProposalComment.comment.thumbsUp).toBe(createdComment.comment.thumbsUp)
            expect(foundProposalComment.comment.thumbsDown).toBe(createdComment.comment.thumbsDown)

            const { id, username, isEmailPasswordEnabled } = usr1SessionData.user
            expect(foundProposalComment.comment.author).toMatchObject({ id, username, isEmailPasswordEnabled })
        })
        it('should return empty array when fetching comments for non existing proposal', async () => {
            const proposalComments = await getProposalCommentsService().findAll(1000000, POLKADOT)
            expect(Array.isArray(proposalComments)).toBe(true)
            expect(proposalComments).toHaveLength(0)
        })
    })

    describe('delete proposal comment', () => {
        it('should delete saved comment', async () => {
            const createdComment = await getProposalCommentsService().create(
                proposal.proposalIndex,
                POLKADOT,
                usr1SessionData.user,
                {
                    content: 'This is a comment',
                },
            )
            const foundProposalComments = await getProposalCommentsService().findAll(proposal.proposalIndex, POLKADOT)
            expect(foundProposalComments).toHaveLength(1)

            await getProposalCommentsService().delete(
                proposal.proposalIndex,
                createdComment.comment.id,
                usr1SessionData.user,
            )
            const commentsAfterDelete = await getProposalCommentsService().findAll(proposal.proposalIndex, POLKADOT)
            expect(commentsAfterDelete).toHaveLength(0)
        })
        it('should throw NotFoundException when deleting comments for non existing proposal', async () => {
            const createdComment = await getProposalCommentsService().create(
                proposal.proposalIndex,
                POLKADOT,
                usr1SessionData.user,
                {
                    content: 'This is a comment',
                },
            )
            await expect(
                getProposalCommentsService().delete(10000000, createdComment.id, usr1SessionData.user),
            ).rejects.toThrow(NotFoundException)
        })
        it('should throw NotFoundException when deleting non existing comment', async () => {
            await expect(
                getProposalCommentsService().delete(
                    proposal.proposalIndex,
                    '00000000-0000-0000-0000-000000000000',
                    usr1SessionData.user,
                ),
            ).rejects.toThrow(NotFoundException)
        })
        it('should throw ForbiddenException when deleting comment not owned by the user', async () => {
            const createdComment = await getProposalCommentsService().create(
                proposal.proposalIndex,
                POLKADOT,
                usr1SessionData.user,
                {
                    content: 'This is a comment',
                },
            )
            const usr2 = { id: '00000000-0000-0000-0000-000000000000' } as UserEntity
            await expect(
                getProposalCommentsService().delete(proposal.proposalIndex, createdComment.comment.id, usr2),
            ).rejects.toThrow(ForbiddenException)
        })
    })
    describe('update proposal comment', () => {
        it('should update proposal comment', async () => {
            const createdComment = await getProposalCommentsService().create(
                proposal.proposalIndex,
                POLKADOT,
                usr1SessionData.user,
                {
                    content: 'This is a comment',
                },
            )
            const updatedComment = await getProposalCommentsService().update(
                proposal.proposalIndex,
                POLKADOT,
                createdComment.comment.id,
                { content: 'Edit' },
                usr1SessionData.user,
            )

            expect(updatedComment.id).toBe(createdComment.id)
            expect(updatedComment.comment.createdAt.getTime()).toBe(createdComment.comment.createdAt.getTime())
            expect(updatedComment.comment.updatedAt.getTime()).not.toBe(createdComment.comment.updatedAt.getTime())
            expect(updatedComment.comment.content).toBe('Edit')
            expect(updatedComment.comment.thumbsUp).toBe(createdComment.comment.thumbsUp)
            expect(updatedComment.comment.thumbsDown).toBe(createdComment.comment.thumbsDown)
        })

        it('should throw ForbiddenException when updating other user proposal comment', async () => {
            const createdComment = await getProposalCommentsService().create(
                proposal.proposalIndex,
                POLKADOT,
                usr1SessionData.user,
                {
                    content: 'This is a comment',
                },
            )
            await expect(
                getProposalCommentsService().update(
                    proposal.proposalIndex,
                    POLKADOT,
                    createdComment.comment.id,
                    { content: 'Edit' },
                    { id: '00000000-0000-0000-0000-000000000000' } as UserEntity,
                ),
            ).rejects.toThrow(ForbiddenException)
        })

        it('should throw NotFoundException when updating comment to wrong proposal', async () => {
            const createdComment = await getProposalCommentsService().create(
                proposal.proposalIndex,
                POLKADOT,
                usr1SessionData.user,
                {
                    content: 'This is a comment',
                },
            )
            await expect(
                getProposalCommentsService().update(
                    100000,
                    POLKADOT,
                    createdComment.comment.id,
                    { content: 'Edit' },
                    usr1SessionData.user,
                ),
            ).rejects.toThrow(NotFoundException)
        })

        it('should throw NotFoundException when updating comment with wrong id', async () => {
            await getProposalCommentsService().create(proposal.proposalIndex, POLKADOT, usr1SessionData.user, {
                content: 'This is a comment',
            })
            await expect(
                getProposalCommentsService().update(
                    proposal.proposalIndex,
                    POLKADOT,
                    '00000000-0000-0000-0000-000000000000',
                    { content: 'Edit' },
                    usr1SessionData.user,
                ),
            ).rejects.toThrow(NotFoundException)
        })
    })
})
