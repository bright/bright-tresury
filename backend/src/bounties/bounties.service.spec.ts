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
import { UserEntity } from '../users/user.entity'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../utils/spec.helpers'
import { NetworkPlanckValue } from '../utils/types'
import { BountiesService } from './bounties.service'
import { BountyEntity } from './entities/bounty.entity'
import {
    blockchainBounty0,
    blockchainBounty1,
    blockchainBountyActive,
    blockchainBountyApproved,
    blockchainBountyCuratorProposed,
    blockchainBountyFunded,
    blockchainBountyPendingPayout,
    createBountyEntity,
    createCuratorSessionData,
    createProposerSessionData,
    minimalValidCreateDto,
    mockGetBounties,
    mockListenForExtrinsic,
    mockListenForExtrinsicWithNoEvent,
} from './spec.helpers'
import { TimeFrame } from '../utils/time-frame.query'
import { PaginatedParams } from '../utils/pagination/paginated.param'

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
            const [blockchain, entity] = await service().update(
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

            it('curator should resolve when has curator', async () => {
                const { bountyEntity } = await setUpUpdate(blockchainBountyCuratorProposed)
                const curator = await createCuratorSessionData(blockchainBountyCuratorProposed)

                return expect(
                    service().update(bountyEntity.blockchainIndex, bountyEntity.networkId, {}, curator.user),
                ).resolves.toBeDefined()
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
        describe('when status', () => {
            it('PendingPayout should throw BadRequestException', async () => {
                const { user, bountyEntity } = await setUpUpdate(blockchainBountyPendingPayout)

                return expect(
                    service().update(bountyEntity.blockchainIndex, bountyEntity.networkId, {}, user),
                ).rejects.toThrow(BadRequestException)
            })

            it('Proposed should resolve', async () => {
                const { user, bountyEntity } = await setUpUpdate(blockchainBounty0)

                return expect(
                    service().update(bountyEntity.blockchainIndex, bountyEntity.networkId, {}, user),
                ).resolves.toBeDefined()
            })
            it('Approved should resolve', async () => {
                const { user, bountyEntity } = await setUpUpdate(blockchainBountyApproved)

                return expect(
                    service().update(bountyEntity.blockchainIndex, bountyEntity.networkId, {}, user),
                ).resolves.toBeDefined()
            })
            it('Funded should resolve', async () => {
                const { user, bountyEntity } = await setUpUpdate(blockchainBountyFunded)

                return expect(
                    service().update(bountyEntity.blockchainIndex, bountyEntity.networkId, {}, user),
                ).resolves.toBeDefined()
            })
            it('CuratorProposed should resolve', async () => {
                const { user, bountyEntity } = await setUpUpdate(blockchainBountyCuratorProposed)

                return expect(
                    service().update(bountyEntity.blockchainIndex, bountyEntity.networkId, {}, user),
                ).resolves.toBeDefined()
            })
            it('Active should resolve', async () => {
                const { user, bountyEntity } = await setUpUpdate(blockchainBountyActive)

                return expect(
                    service().update(bountyEntity.blockchainIndex, bountyEntity.networkId, {}, user),
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
                TimeFrame.OnChain,
                new PaginatedParams({pageSize: '10', pageNumber: '1'})
            )
            const bounties = paginatedBounties.items
            expect(Array.isArray(bounties)).toBe(true)
            expect(bounties).toHaveLength(7)
        })
    })

    describe('getBounty', () => {
        beforeAll(() => {
            mockGetBounties(app().get(BlockchainBountiesService))
        })
        it('should return correct bounty tuple', async () => {
            const [blockchainBounty, bountyEntity] = await service().getBounty(NETWORKS.POLKADOT, 0)
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
            return expect(service().getBounty(NETWORKS.POLKADOT, 99)).rejects.toThrow(NotFoundException)
        })
    })

    describe('getBountyMotions', () => {
        beforeAll(() => {
            mockGetBounties(app().get(BlockchainBountiesService))
        })
        it('should throw NotFoundException when asking for bounty with wrong blockchainIndex', async () => {
            return expect(service().getBountyMotions(NETWORKS.POLKADOT, 99)).rejects.toThrow(NotFoundException)
        })
    })
})
