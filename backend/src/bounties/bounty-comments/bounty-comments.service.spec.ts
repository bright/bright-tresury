import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { BlockchainBountiesService } from '../../blockchain/blockchain-bounties/blockchain-bounties.service'
import { CommentEntity } from '../../comments/comment.entity'
import { createSessionData } from '../../ideas/spec.helpers'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../utils/spec.helpers'
import { blockchainBounty0, blockchainBounty1, mockGetBounties } from '../spec.helpers'
import { BountyCommentsService } from './bounty-comments.service'
import { BountyCommentEntity } from './entities/bounty-comment.entity'
import { v4 as uuid } from 'uuid'

describe('BountyCommentsService', () => {
    const app = beforeSetupFullApp()
    const service = beforeAllSetup(() => app().get<BountyCommentsService>(BountyCommentsService))
    const repository = beforeAllSetup(() =>
        app().get<Repository<BountyCommentEntity>>(getRepositoryToken(BountyCommentEntity)),
    )
    const commentsRepository = beforeAllSetup(() =>
        app().get<Repository<CommentEntity>>(getRepositoryToken(CommentEntity)),
    )

    beforeAll(() => {
        mockGetBounties(app().get(BlockchainBountiesService))
    })

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    const setUp = async () => {
        const { user } = await createSessionData()
        const commentForBounty0 = await service().create(
            blockchainBounty0.index,
            NETWORKS.POLKADOT,
            { content: 'some content' },
            user,
        )
        return { user, commentForBounty0 }
    }

    describe('findAll', () => {
        it('should return all comments for a bounty', async () => {
            const { commentForBounty0, user } = await setUp()
            const result = await service().findAll(blockchainBounty0.index, NETWORKS.POLKADOT)

            expect(result).toHaveLength(1)
            expect(result[0].blockchainBountyId).toBe(blockchainBounty0.index)
            expect(result[0].networkId).toBe(NETWORKS.POLKADOT)
            expect(result[0].comment.content).toBe(commentForBounty0.comment.content)
            expect(result[0].comment.author!.id).toBe(user.id)
            expect(result[0].comment.author!.web3Addresses).toStrictEqual([])
        })

        it('should return empty array when no comments', async () => {
            const result = await service().findAll(blockchainBounty1.index, NETWORKS.POLKADOT)
            expect(result).toHaveLength(0)
        })

        it('should throw NotFoundException when no bounty exists', async () => {
            return expect(service().findAll(100, NETWORKS.POLKADOT)).rejects.toThrow(NotFoundException)
        })
    })

    describe('create', () => {
        it('should return created bounty comment entity', async () => {
            const { user } = await setUp()
            const result = await service().create(
                blockchainBounty0.index,
                NETWORKS.POLKADOT,
                { content: 'the content' },
                user,
            )

            expect(result.blockchainBountyId).toBe(blockchainBounty0.index)
            expect(result.networkId).toBe(NETWORKS.POLKADOT)
            expect(result.comment.authorId).toBe(user.id)
            expect(result.comment.content).toBe('the content')
        })

        it('should create bounty entity', async () => {
            const { user } = await setUp()
            const result = await service().create(
                blockchainBounty0.index,
                NETWORKS.POLKADOT,
                { content: 'the content' },
                user,
            )

            const saved = (await repository().findOne(result.id))!
            expect(saved.blockchainBountyId).toBe(blockchainBounty0.index)
            expect(saved.networkId).toBe(NETWORKS.POLKADOT)
            expect(saved.comment.authorId).toBe(user.id)
            expect(saved.comment.content).toBe('the content')
        })

        it('should throw NotFoundException when no bounty exists', async () => {
            const { user } = await setUp()
            return expect(service().create(100, NETWORKS.POLKADOT, { content: 'the content' }, user)).rejects.toThrow(
                NotFoundException,
            )
        })
    })

    describe('update', () => {
        it('should return updated bounty comment entity', async () => {
            const { user, commentForBounty0 } = await setUp()
            const result = await service().update(
                blockchainBounty0.index,
                NETWORKS.POLKADOT,
                commentForBounty0.comment.id,
                { content: 'the new content' },
                user,
            )

            expect(result.blockchainBountyId).toBe(commentForBounty0.blockchainBountyId)
            expect(result.networkId).toBe(commentForBounty0.networkId)
            expect(result.comment.content).toBe('the new content')
        })

        it('should update bounty entity', async () => {
            const { user, commentForBounty0 } = await setUp()
            const result = await service().update(
                blockchainBounty0.index,
                NETWORKS.POLKADOT,
                commentForBounty0.comment.id,
                { content: 'the new content' },
                user,
            )

            const saved = (await repository().findOne(result.id))!
            expect(saved.blockchainBountyId).toBe(commentForBounty0.blockchainBountyId)
            expect(saved.networkId).toBe(commentForBounty0.networkId)
            expect(saved.comment.content).toBe('the new content')
        })

        it('should throw NotFoundException when no bounty exists', async () => {
            const { user, commentForBounty0 } = await setUp()
            return expect(
                service().update(
                    100,
                    NETWORKS.POLKADOT,
                    commentForBounty0.comment.id,
                    { content: 'the new content' },
                    user,
                ),
            ).rejects.toThrow(NotFoundException)
        })

        it('should throw NotFoundException when comment does not exist', async () => {
            const { user } = await setUp()
            return expect(
                service().update(
                    blockchainBounty0.index,
                    NETWORKS.POLKADOT,
                    uuid(),
                    { content: 'the new content' },
                    user,
                ),
            ).rejects.toThrow(NotFoundException)
        })

        it('should throw ForbiddenException when not the bounty owner', async () => {
            const { commentForBounty0 } = await setUp()
            const { user: otherUser } = await createSessionData({ username: 'other', email: 'other@example.com' })
            return expect(
                service().update(
                    blockchainBounty0.index,
                    NETWORKS.POLKADOT,
                    commentForBounty0.comment.id,
                    { content: 'the new content' },
                    otherUser,
                ),
            ).rejects.toThrow(ForbiddenException)
        })
    })

    describe('delete', () => {
        it('should delete bounty comment entity', async () => {
            const { user, commentForBounty0 } = await setUp()
            await service().delete(blockchainBounty0.index, NETWORKS.POLKADOT, commentForBounty0.comment.id, user)

            const saved = (await repository().findOne(commentForBounty0.comment.id))!
            expect(saved).toBeUndefined()
        })

        it('should delete comment entity', async () => {
            const { user, commentForBounty0 } = await setUp()
            await service().delete(blockchainBounty0.index, NETWORKS.POLKADOT, commentForBounty0.comment.id, user)

            const saved = (await commentsRepository().findOne(commentForBounty0.comment.id))!
            expect(saved).toBeUndefined()
        })

        it('should throw NotFoundException when no bounty exists', async () => {
            const { user, commentForBounty0 } = await setUp()
            return expect(service().delete(100, NETWORKS.POLKADOT, commentForBounty0.comment.id, user)).rejects.toThrow(
                NotFoundException,
            )
        })

        it('should throw NotFoundException when comment does not exist', async () => {
            const { user } = await setUp()
            return expect(service().delete(blockchainBounty0.index, NETWORKS.POLKADOT, uuid(), user)).rejects.toThrow(
                NotFoundException,
            )
        })

        it('should throw ForbiddenException when not the bounty owner', async () => {
            const { commentForBounty0 } = await setUp()
            const { user: otherUser } = await createSessionData({ username: 'other', email: 'other@example.com' })
            return expect(
                service().delete(blockchainBounty0.index, NETWORKS.POLKADOT, commentForBounty0.comment.id, otherUser),
            ).rejects.toThrow(ForbiddenException)
        })
    })
})
