import { NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { BlockchainBountiesService } from '../../blockchain/blockchain-bounties/blockchain-bounties.service'
import { createSessionData } from '../../ideas/spec.helpers'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../utils/spec.helpers'
import { blockchainBounty0, mockGetBounties } from '../spec.helpers'
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
        return { user }
    }

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
