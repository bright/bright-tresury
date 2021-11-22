import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { BlockchainService } from '../blockchain/blockchain.service'
import { ExtrinsicsService } from '../extrinsics/extrinsics.service'
import { createSessionData } from '../ideas/spec.helpers'
import { UserEntity } from '../users/user.entity'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../utils/spec.helpers'
import { NetworkPlanckValue } from '../utils/types'
import { BountiesService } from './bounties.service'
import { CreateBountyDto } from './dto/create-bounty.dto'
import { BountyEntity } from './entities/bounty.entity'
import { blockchainBounties, mockListenForExtrinsic, mockListenForExtrinsicWithNoEvent } from './spec.helpers'
import { BlockchainBountiesService } from '../blockchain/blockchain-bounties/blockchain-bounties.service'
import { BlockchainBountyStatus } from '../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { NotFoundException } from '@nestjs/common'

describe('BountiesService', () => {
    const app = beforeSetupFullApp()

    const service = beforeAllSetup(() => app().get<BountiesService>(BountiesService))
    const repository = beforeAllSetup(() => app().get<Repository<BountyEntity>>(getRepositoryToken(BountyEntity)))
    const blockchainService = beforeAllSetup(() => app().get<BlockchainService>(BlockchainService))
    const extrinsicsService = beforeAllSetup(() => app().get<ExtrinsicsService>(ExtrinsicsService))

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    const setUp = async () => {
        const { user } = await createSessionData()
        return { user }
    }

    const minimalValidCreateDto: CreateBountyDto = {
        blockchainDescription: 'bc-description',
        value: '10' as NetworkPlanckValue,
        title: 'title',
        networkId: NETWORKS.POLKADOT,
        proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        extrinsicHash: '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
        lastBlockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
    }

    describe('create', () => {
        it('should return created bounty entity', async () => {
            const { user } = await setUp()
            const result = await service().create(
                {
                    blockchainDescription: 'bc-description',
                    value: '10' as NetworkPlanckValue,
                    title: 'title',
                    field: 'optimisation',
                    description: 'description',
                    networkId: NETWORKS.POLKADOT,
                    proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
                    extrinsicHash: '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
                    lastBlockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
                    blockchainIndex: 3,
                },
                user,
            )
            expect(result.blockchainDescription).toBe('bc-description')
            expect(result.value).toBe('10')
            expect(result.title).toBe('title')
            expect(result.field).toBe('optimisation')
            expect(result.description).toBe('description')
            expect(result.networkId).toBe(NETWORKS.POLKADOT)
            expect(result.proposer).toBe('15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5')
            expect(result.blockchainIndex).toBe(3)
            expect(result.owner).toMatchObject<UserEntity>(user)
        })

        it('should create bounty entity', async () => {
            const { user } = await setUp()
            const result = await service().create(
                {
                    blockchainDescription: 'bc-description',
                    value: '10' as NetworkPlanckValue,
                    title: 'title',
                    field: 'optimisation',
                    description: 'description',
                    networkId: NETWORKS.POLKADOT,
                    proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
                    extrinsicHash: '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
                    lastBlockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
                    blockchainIndex: 3,
                },
                user,
            )
            const saved = (await repository().findOne(result.id))!
            expect(saved.blockchainDescription).toBe('bc-description')
            expect(saved.value).toBe('10')
            expect(saved.title).toBe('title')
            expect(saved.field).toBe('optimisation')
            expect(saved.description).toBe('description')
            expect(saved.networkId).toBe(NETWORKS.POLKADOT)
            expect(saved.proposer).toBe('15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5')
            expect(saved.blockchainIndex).toBe(3)
        })

        it('should assign owner id', async () => {
            const { user } = await setUp()
            const result = await service().create({...minimalValidCreateDto, blockchainIndex: 0}, user)
            const saved = (await repository().findOne(result.id))!
            expect(saved.ownerId).toBe(user.id)
        })
    })

    describe('listenForProposeBountyExtrinsic', () => {
        beforeAll(() => {
            mockListenForExtrinsic(blockchainService())
        })

        afterEach(() => {
            jest.clearAllMocks()
        })

        it('should call listenForExtrinsic method', async () => {
            const { user } = await setUp()
            const spy = jest.spyOn(extrinsicsService(), 'listenForExtrinsic')
            await service().listenForProposeBountyExtrinsic(minimalValidCreateDto, user)
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
            const result = await service().listenForProposeBountyExtrinsic(minimalValidCreateDto, user)
            expect(result).toBeDefined()
            expect(result.extrinsicHash).toBe(minimalValidCreateDto.extrinsicHash)
            expect(result.lastBlockHash).toBe(minimalValidCreateDto.lastBlockHash)
            expect(result.data).toStrictEqual(minimalValidCreateDto)
        })

        it('should call create bounty method when extrinsic with BountyProposed event', async () => {
            const { user } = await setUp()
            const spy = jest.spyOn(service(), 'create')

            const extrinsic = await service().listenForProposeBountyExtrinsic(minimalValidCreateDto, user)

            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(
                { ...minimalValidCreateDto, blockchainIndex: 3 },
                expect.objectContaining({ id: user.id }),
            )
        })

        it('should not call create bounty method when extrinsic with no BountyProposed event', async () => {
            await mockListenForExtrinsicWithNoEvent(blockchainService())
            const { user } = await setUp()
            const spy = jest.spyOn(service(), 'create')

            await service().listenForProposeBountyExtrinsic(minimalValidCreateDto, user)

            expect(spy).not.toHaveBeenCalled()
        })
    })
    describe('getBounties', () => {
        beforeAll(() => {
            jest.spyOn(app().get(BlockchainBountiesService), 'getBounties')
                .mockImplementation(async (networkId) => blockchainBounties)
        })

        it('should return two bounties', async () => {
            const bountiesTuples = await service().getBounties(NETWORKS.POLKADOT)
            expect(Array.isArray(bountiesTuples)).toBe(true)
            expect(bountiesTuples).toHaveLength(2)
        })
    })
    describe('getBounty', () => {
        beforeAll(() => {
            jest.spyOn(app().get(BlockchainBountiesService), 'getBounties')
                .mockImplementation(async (networkId) => blockchainBounties)
        })
        it('should return correct bounty tuple', async () => {
            const [blockchainBounty, bountyEntity] = await service().getBounty(0, NETWORKS.POLKADOT)
            expect(blockchainBounty).toBeDefined()
            expect(bountyEntity).toBeUndefined()

            expect(blockchainBounty.index).toBe(0)
            expect(blockchainBounty.description).toBe('bc-description-1')
            expect(blockchainBounty.proposer.address).toBe('15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5')
            expect(blockchainBounty.value).toBe('10000')
            expect(blockchainBounty.fee).toBe('100')
            expect(blockchainBounty.curatorDeposit).toBe('0')
            expect(blockchainBounty.bond).toBe('10')
            expect(blockchainBounty.status).toBe(BlockchainBountyStatus.Proposed)
        })
        it('should throw NotFoundException when asking for bounty with wrong blockchainIndex', async () => {
            return expect(service().getBounty(5, NETWORKS.POLKADOT)).rejects.toThrow(NotFoundException)
        })
    })
})
