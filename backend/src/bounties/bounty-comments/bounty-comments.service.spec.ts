import { NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { BlockchainBountiesService } from '../../blockchain/blockchain-bounties/blockchain-bounties.service'
import { createSessionData } from '../../ideas/spec.helpers'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../utils/spec.helpers'
import { blockchainBounty0, blockchainBounty1, mockGetBounties } from '../spec.helpers'
import { BountyCommentsService } from './bounty-comments.service'
import { BountyCommentEntity } from './entities/bounty-comment.entity'

describe('BountyCommentsService', () => {
    const app = beforeSetupFullApp()
    const service = beforeAllSetup(() => app().get<BountyCommentsService>(BountyCommentsService))
    const repository = beforeAllSetup(() =>
        app().get<Repository<BountyCommentEntity>>(getRepositoryToken(BountyCommentEntity)),
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
            { networkId: NETWORKS.POLKADOT, content: 'some content' },
            user,
        )
        return { user, commentForBounty0 }
    }

    describe('getAll', () => {
        it('should return all comments for a bounty', async () => {
            const { commentForBounty0, user } = await setUp()
            const result = await service().getAll(blockchainBounty0.index, NETWORKS.POLKADOT)

            expect(result).toHaveLength(1)
            expect(result[0].blockchainBountyId).toBe(blockchainBounty0.index)
            expect(result[0].networkId).toBe(NETWORKS.POLKADOT)
            expect(result[0].comment.content).toBe(commentForBounty0.comment.content)
            expect(result[0].comment.author!.id).toBe(user.id)
            expect(result[0].comment.author!.web3Addresses).toStrictEqual([])
        })

        it('should return empty array when no comments', async () => {
            const result = await service().getAll(blockchainBounty1.index, NETWORKS.POLKADOT)
            expect(result).toHaveLength(0)
        })

        it('should throw NotFoundException when no bounty exists', async () => {
            return expect(service().getAll(100, NETWORKS.POLKADOT)).rejects.toThrow(NotFoundException)
        })
    })

    describe('create', () => {
        it('should return created bounty comment entity', async () => {
            const { user } = await setUp()
            const result = await service().create(
                blockchainBounty0.index,
                { content: 'the content', networkId: NETWORKS.POLKADOT },
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
                { content: 'the content', networkId: NETWORKS.POLKADOT },
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
            return expect(
                service().create(100, { content: 'the content', networkId: NETWORKS.POLKADOT }, user),
            ).rejects.toThrow(NotFoundException)
        })
    })
})
