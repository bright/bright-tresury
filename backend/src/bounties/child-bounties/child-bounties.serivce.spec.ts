import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../utils/spec.helpers'
import { ChildBountiesService } from './child-bounties.service'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createSessionData } from '../../ideas/spec.helpers'
import {
    mockListenForExtrinsic,
    minimalValidCreateDto,
    updateExtrinsicWithAddedEventDto,
    updateExtrinsicWithNoEventsDto,
} from './spec.helpers'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { ExtrinsicsService } from '../../extrinsics/extrinsics.service'
import { UserEntity } from '../../users/entities/user.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ChildBountyEntity } from './entities/child-bounty.entity'

describe('ChildBountiesService', () => {
    const app = beforeSetupFullApp()
    const service = beforeAllSetup(() => app().get<ChildBountiesService>(ChildBountiesService))
    const blockchainService = beforeAllSetup(() => app().get<BlockchainService>(BlockchainService))
    const extrinsicsService = beforeAllSetup(() => app().get<ExtrinsicsService>(ExtrinsicsService))
    const repository = beforeAllSetup(() =>
        app().get<Repository<ChildBountyEntity>>(getRepositoryToken(ChildBountyEntity)),
    )

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })
    const setUp = async () => {
        const { user } = await createSessionData()
        return { user }
    }
    describe('listenForAddedChildBountyExtrinsic', () => {
        beforeAll(() => {
            mockListenForExtrinsic(blockchainService(), updateExtrinsicWithAddedEventDto)
        })

        afterEach(() => {
            jest.clearAllMocks()
        })
        it('should call listenForExtrinsic method', async () => {
            const { user } = await setUp()
            const spy = jest.spyOn(extrinsicsService(), 'listenForExtrinsic')
            await service().listenForAddedChildBountyExtrinsic(minimalValidCreateDto, 0, user)
            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(
                minimalValidCreateDto.networkId,
                {
                    extrinsicHash: minimalValidCreateDto.extrinsicHash,
                    lastBlockHash: minimalValidCreateDto.lastBlockHash,
                    data: minimalValidCreateDto,
                },
                expect.anything(),
            )
        })
        it('should return extrinsic', async () => {
            const { user } = await setUp()
            const result = await service().listenForAddedChildBountyExtrinsic(minimalValidCreateDto, 0, user)
            expect(result).toBeDefined()
            expect(result.extrinsicHash).toBe(minimalValidCreateDto.extrinsicHash)
            expect(result.lastBlockHash).toBe(minimalValidCreateDto.lastBlockHash)
            expect(result.data).toStrictEqual(minimalValidCreateDto)
        })
        it('should call create child bounty method when extrinsic with Added event', async () => {
            const { user } = await setUp()
            const spy = jest.spyOn(service(), 'create')

            await service().listenForAddedChildBountyExtrinsic(minimalValidCreateDto, 0, user)

            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(
                {
                    ...minimalValidCreateDto,
                    blockchainIndex: 2,
                    parentBountyBlockchainIndex: 0,
                },
                expect.objectContaining({ id: user.id }),
            )
        })
        it('should not call create child bounty method when extrinsic with no Added event', async () => {
            await mockListenForExtrinsic(blockchainService(), updateExtrinsicWithNoEventsDto)
            const { user } = await setUp()
            const spy = jest.spyOn(service(), 'create')

            await service().listenForAddedChildBountyExtrinsic(minimalValidCreateDto, 0, user)

            expect(spy).not.toHaveBeenCalled()
        })
    })
    describe('create', () => {
        it('should return created child bounty entity', async () => {
            const { user } = await setUp()
            const result = await service().create(
                {
                    ...minimalValidCreateDto,
                    description: 'description',
                    blockchainIndex: 3,
                    parentBountyBlockchainIndex: 1,
                },
                user,
            )

            expect(result.title).toBe(minimalValidCreateDto.title)
            expect(result.description).toBe('description')
            expect(result.networkId).toBe(minimalValidCreateDto.networkId)
            expect(result.blockchainIndex).toBe(3)
            expect(result.parentBountyBlockchainIndex).toBe(1)
            expect(result.owner).toMatchObject<UserEntity>(user)
        })

        it('should create bounty entity', async () => {
            const { user } = await setUp()
            const result = await service().create(
                {
                    ...minimalValidCreateDto,
                    description: 'description',
                    blockchainIndex: 3,
                    parentBountyBlockchainIndex: 1,
                },
                user,
            )
            const saved = (await repository().findOne(result.id))!
            expect(result.title).toBe(minimalValidCreateDto.title)
            expect(result.description).toBe('description')
            expect(result.networkId).toBe(minimalValidCreateDto.networkId)
            expect(saved.blockchainIndex).toBe(3)
            expect(result.parentBountyBlockchainIndex).toBe(1)
        })

        it('should assign owner id', async () => {
            const { user } = await setUp()
            const result = await service().create(
                {
                    ...minimalValidCreateDto,
                    blockchainIndex: 3,
                    parentBountyBlockchainIndex: 1,
                },
                user,
            )
            const saved = (await repository().findOne(result.id))!
            expect(saved.ownerId).toBe(user.id)
        })
    })
})
