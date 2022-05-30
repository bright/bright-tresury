import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { BlockchainBountiesService } from '../blockchain/blockchain-bounties/blockchain-bounties.service'
import {
    BlockchainBountyDto,
    BlockchainBountyStatus,
} from '../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { BlockchainService } from '../blockchain/blockchain.service'
import { ExtrinsicsService } from '../extrinsics/extrinsics.service'
import { createSessionData, createWeb3SessionData } from '../ideas/spec.helpers'
import { PolkassemblyBountiesService } from '../polkassembly/bounties/polkassembly-bounties.service'
import { UserEntity } from '../users/entities/user.entity'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../utils/spec.helpers'
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { v4 as uuid } from 'uuid'
import { UsersService } from '../users/users.service'
import { TimeFrame } from '../utils/time-frame.query'
import { BountiesService } from './bounties.service'
import { BountyEntity } from './entities/bounty.entity'
import {
    blockchainBounty0,
    blockchainBountyActive,
    blockchainBountyApproved,
    blockchainBountyCuratorProposed,
    createBountyEntity,
    createCuratorSessionData,
    createProposerSessionData,
    minimalValidCreateDto,
    mockGetBounties,
    mockGetPolkassemblyBounty,
    mockListenForExtrinsic,
    mockListenForExtrinsicWithNoEvent,
} from './spec.helpers'

describe('BountiesService', () => {
    const app = beforeSetupFullApp()

    const service = beforeAllSetup(() => app().get<BountiesService>(BountiesService))
    const usersService = beforeAllSetup(() => app().get<UsersService>(UsersService))
    const repository = beforeAllSetup(() => app().get<Repository<BountyEntity>>(getRepositoryToken(BountyEntity)))
    const blockchainService = beforeAllSetup(() => app().get<BlockchainService>(BlockchainService))
    const polkassemblyService = beforeAllSetup(() =>
        app().get<PolkassemblyBountiesService>(PolkassemblyBountiesService),
    )
    const extrinsicsService = beforeAllSetup(() => app().get<ExtrinsicsService>(ExtrinsicsService))

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    const setUp = async () => {
        const { user } = await createSessionData()
        return { user }
    }

    describe('create', () => {
        it('should return created bounty entity', async () => {
            const { user } = await setUp()
            const result = await service().create(
                {
                    title: 'title',
                    field: 'optimisation',
                    description: 'description',
                    networkId: NETWORKS.POLKADOT,
                    blockchainIndex: 3,
                },
                user,
            )
            expect(result.title).toBe('title')
            expect(result.field).toBe('optimisation')
            expect(result.description).toBe('description')
            expect(result.networkId).toBe(NETWORKS.POLKADOT)
            expect(result.blockchainIndex).toBe(3)
            expect(result.owner).toMatchObject<UserEntity>(user)
        })

        it('should create bounty entity', async () => {
            const { user } = await setUp()
            const result = await service().create(
                {
                    title: 'title',
                    field: 'optimisation',
                    description: 'description',
                    networkId: NETWORKS.POLKADOT,
                    blockchainIndex: 3,
                },
                user,
            )
            const saved = (await repository().findOne(result.id))!
            expect(saved.title).toBe('title')
            expect(saved.field).toBe('optimisation')
            expect(saved.description).toBe('description')
            expect(saved.networkId).toBe(NETWORKS.POLKADOT)
            expect(saved.blockchainIndex).toBe(3)
        })

        it('should assign owner id', async () => {
            const { user } = await setUp()
            const result = await service().create({ ...minimalValidCreateDto, blockchainIndex: 0 }, user)
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

    describe('update', () => {
        beforeAll(() => {
            mockGetBounties(app().get(BlockchainBountiesService))
        })

        const setUpUpdate = async (blockchainBounty: BlockchainBountyDto = blockchainBounty0) => {
            const { user } = await createSessionData()
            const bountyEntity = await createBountyEntity(service(), user, { blockchainIndex: blockchainBounty.index })
            return {
                user,
                bountyEntity,
            }
        }

        it('should return updated bounty entity', async () => {
            const { user, bountyEntity } = await setUpUpdate()
            const { blockchain, entity } = await service().update(
                bountyEntity.blockchainIndex,
                bountyEntity.networkId,
                {
                    title: 'new title',
                    field: 'new field',
                    description: 'new description',
                    beneficiary: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
                },
                user,
            )
            expect(blockchain.index).toBe(bountyEntity.blockchainIndex)
            expect(entity!.title).toBe('new title')
            expect(entity!.field).toBe('new field')
            expect(entity!.description).toBe('new description')
            expect(entity!.beneficiary).toBe('15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5')
        })

        it('should update bounty entity', async () => {
            const { user, bountyEntity } = await setUpUpdate()
            await service().update(
                bountyEntity.blockchainIndex,
                bountyEntity.networkId,
                {
                    title: 'new title',
                    field: 'new field',
                    description: 'new description',
                    beneficiary: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
                },
                user,
            )
            const saved = (await repository().findOne(bountyEntity.id))!
            expect(saved.title).toBe('new title')
            expect(saved.field).toBe('new field')
            expect(saved.description).toBe('new description')
            expect(saved.beneficiary).toBe('15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5')
        })

        it('should create new entity if no entity', async () => {
            const proposer = await createProposerSessionData(blockchainBounty0)
            await service().update(blockchainBounty0.index, NETWORKS.POLKADOT, { title: 'title' }, proposer.user)

            const saved = (await repository().findOne({
                blockchainIndex: blockchainBounty0.index,
                networkId: NETWORKS.POLKADOT,
            }))!
            expect(saved.ownerId).toBe(proposer.user.id)
            expect(saved.title).toBe('title')
        })

        it('should throw BadRequestException if no entity and no title in dto', async () => {
            const proposer = await createProposerSessionData(blockchainBounty0)

            return expect(
                service().update(blockchainBounty0.index, NETWORKS.POLKADOT, {}, proposer.user),
            ).rejects.toThrow(BadRequestException)
        })

        it('should throw NotFoundException when no blockchain bounty', async () => {
            const { user } = await setUpUpdate({ index: 100 } as BlockchainBountyDto)
            return expect(service().update(100, NETWORKS.POLKADOT, {}, user)).rejects.toThrow(NotFoundException)
        })

        describe('called by', () => {
            it('not owner, curator, proposer should throw ForbiddenException', async () => {
                const { user, bountyEntity } = await setUpUpdate()
                const otherUser = await createWeb3SessionData('12TpXjttC29ZBEwHqdmbEtXJ9JSR9NZm2nxsrMwfXUHoxX6U')

                return expect(
                    service().update(bountyEntity.blockchainIndex, bountyEntity.networkId, {}, otherUser.user),
                ).rejects.toThrow(ForbiddenException)
            })

            it('owner should resolve', async () => {
                const { user, bountyEntity } = await setUpUpdate()

                return expect(
                    service().update(bountyEntity.blockchainIndex, bountyEntity.networkId, {}, user),
                ).resolves.toBeDefined()
            })

            it('curator should resolve when has curator and active', async () => {
                const { bountyEntity } = await setUpUpdate(blockchainBountyActive)
                const curator = await createCuratorSessionData(blockchainBountyActive)

                return expect(
                    service().update(bountyEntity.blockchainIndex, bountyEntity.networkId, {}, curator.user),
                ).resolves.toBeDefined()
            })

            it('curator should throw ForbiddenException when has curator but not accepted', async () => {
                const { bountyEntity } = await setUpUpdate(blockchainBountyCuratorProposed)
                const curator = await createCuratorSessionData(blockchainBountyCuratorProposed)

                return expect(
                    service().update(bountyEntity.blockchainIndex, bountyEntity.networkId, {}, curator.user),
                ).rejects.toThrow(ForbiddenException)
            })

            it('curator should throw ForbiddenException when no curator', async () => {
                const { bountyEntity } = await setUpUpdate(blockchainBountyApproved)
                const curator = await createWeb3SessionData('12TpXjttC29ZBEwHqdmbEtXJ9JSR9NZm2nxsrMwfXUHoxX6U')

                return expect(
                    service().update(bountyEntity.blockchainIndex, bountyEntity.networkId, {}, curator.user),
                ).rejects.toThrow(ForbiddenException)
            })

            it('proposer should resolve', async () => {
                const { bountyEntity } = await setUpUpdate()
                const proposer = await createProposerSessionData(blockchainBounty0)

                return expect(
                    service().update(bountyEntity.blockchainIndex, bountyEntity.networkId, {}, proposer.user),
                ).resolves.toBeDefined()
            })
        })
    })

    describe('getBounties', () => {
        beforeAll(() => {
            mockGetBounties(app().get(BlockchainBountiesService))
        })

        it('should return seven bounties', async () => {
            const paginatedBounties = await service().find(
                NETWORKS.POLKADOT,
                { timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            )
            const bounties = paginatedBounties.items
            expect(Array.isArray(bounties)).toBe(true)
            expect(bounties).toHaveLength(7)
        })
        it(`should return only ${BlockchainBountyStatus.Active} bounties`, async () => {
            const paginatedBounties = await service().find(
                NETWORKS.POLKADOT,
                { status: BlockchainBountyStatus.Active, timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            )
            const bounties = paginatedBounties.items
            expect(Array.isArray(bounties)).toBe(true)
            expect(bounties).not.toHaveLength(0)
            for (const bounty of bounties) expect(bounty.blockchain.status).toBe(BlockchainBountyStatus.Active)
        })
        it(`should return only ${BlockchainBountyStatus.Approved} bounties`, async () => {
            const paginatedBounties = await service().find(
                NETWORKS.POLKADOT,
                { status: BlockchainBountyStatus.Approved, timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            )
            const bounties = paginatedBounties.items
            expect(Array.isArray(bounties)).toBe(true)
            expect(bounties).not.toHaveLength(0)
            for (const bounty of bounties) expect(bounty.blockchain.status).toBe(BlockchainBountyStatus.Approved)
        })
        it('should return bounties with owner by address', async () => {
            const owner = await usersService().createWeb3User({
                authId: uuid(),
                username: uuid(),
                web3Address: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
            })
            const paginatedBounties = await service().find(
                NETWORKS.POLKADOT,
                { ownerId: owner.id, timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            )
            const bounties = paginatedBounties.items
            expect(Array.isArray(bounties)).toBe(true)
            expect(bounties).not.toHaveLength(0)
            for (const bounty of bounties) expect(bounty.isOwner(owner)).toBe(true)
        })
        it('should return bounties with owner by owner id', async () => {
            const { user: owner } = await setUp()
            await createBountyEntity(service(), owner, minimalValidCreateDto)

            const paginatedBounties = await service().find(
                NETWORKS.POLKADOT,
                { ownerId: owner.id, timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            )
            const bounties = paginatedBounties.items
            expect(Array.isArray(bounties)).toBe(true)
            expect(bounties).not.toHaveLength(0)
            for (const bounty of bounties) expect(bounty.isOwner(owner)).toBe(true)
        })
    })

    describe('getBounty', () => {
        beforeAll(() => {
            mockGetBounties(app().get(BlockchainBountiesService))
        })
        it('should return correct bounty tuple', async () => {
            const bounty = await service().getBounty(NETWORKS.POLKADOT, 0)
            expect(bounty.blockchain).toBeDefined()
            expect(bounty.entity).toBeUndefined()

            expect(bounty.blockchain.index).toBe(0)
            expect(bounty.blockchain.description).toBe('bc-description-1')
            expect(bounty.blockchain.proposer).toBe('15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5')
            expect(bounty.blockchain.value).toBe('10000')
            expect(bounty.blockchain.fee).toBe('100')
            expect(bounty.blockchain.curatorDeposit).toBe('0')
            expect(bounty.blockchain.bond).toBe('10')
            expect(bounty.blockchain.status).toBe(BlockchainBountyStatus.Proposed)
        })

        it('should throw NotFoundException when no bounty on-chain and in polkassembly', async () => {
            await mockGetPolkassemblyBounty(polkassemblyService())
            return expect(service().getBounty(NETWORKS.POLKADOT, 99)).rejects.toThrow(NotFoundException)
        })

        it('should return polkassembly data when no bounty on-chain', async () => {
            await mockGetPolkassemblyBounty(polkassemblyService())
            const bounty = await service().getBounty(NETWORKS.POLKADOT, 10)

            expect(bounty.blockchain).toBeDefined()
            expect(bounty.blockchain.index).toBe(10)
            expect(bounty.entity).toBeUndefined()
            expect(bounty.polkassembly).toBeDefined()
        })
    })

    describe('getBountyMotions', () => {
        beforeAll(() => {
            mockGetBounties(app().get(BlockchainBountiesService))
        })
        it('should return empty array when no bounty in blockchain and no motion in polkassembly', async () => {
            const result = await service().getBountyMotions(NETWORKS.POLKADOT, 99)
            expect(result).toHaveLength(0)
        })
    })
    describe('getCurator', () => {
        beforeAll(() => {
            mockGetBounties(app().get(BlockchainBountiesService))
        })
        it('should throw NotFoundException when bounty does not exist', async () => {
            return expect(service().getCurator(NETWORKS.POLKADOT, 99)).rejects.toThrow(NotFoundException)
        })
        it('should return undefined when bounty has not curator assigned', async () => {
            const result = await service().getCurator(NETWORKS.POLKADOT, 0)
            expect(result).toBeFalsy()
        })
        it('should return curator as PublicUserDto when bounty has curator assigned', async () => {
            const result = await service().getCurator(NETWORKS.POLKADOT, 4)
            expect(result).toMatchObject({ web3address: '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3' })
        })
    })
})
