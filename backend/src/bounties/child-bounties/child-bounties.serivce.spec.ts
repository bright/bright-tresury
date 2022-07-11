import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../utils/spec.helpers'
import { ChildBountiesService } from './child-bounties.service'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createSessionData, createWeb3SessionData } from '../../ideas/spec.helpers'
import {
    blockchainChildBounty4,
    blockchainChildBountyActive,
    blockchainChildBountyNoCurator,
    createChildBountyEntity,
    minimalValidCreateDto,
    mockGetChildBounties,
    mockListenForExtrinsic,
    updateExtrinsicWithAddedEventDto,
    updateExtrinsicWithNoEventsDto,
} from './spec.helpers'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { ExtrinsicsService } from '../../extrinsics/extrinsics.service'
import { UserEntity } from '../../users/entities/user.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ChildBountyEntity } from './entities/child-bounty.entity'
import { BlockchainChildBountiesService } from '../../blockchain/blockchain-child-bounties/blockchain-child-bounties.service'
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { BlockchainChildBountyDto } from '../../blockchain/blockchain-child-bounties/dto/blockchain-child-bounty.dto'
import { PolkassemblyChildBountiesService } from '../../polkassembly/childBounties/polkassembly-childBounties.service'

describe('ChildBountiesService', () => {
    const app = beforeSetupFullApp()
    const service = beforeAllSetup(() => app().get<ChildBountiesService>(ChildBountiesService))
    const blockchainService = beforeAllSetup(() => app().get<BlockchainService>(BlockchainService))
    const blockchainChildBountiesService = beforeAllSetup(() =>
        app().get<BlockchainChildBountiesService>(BlockchainChildBountiesService),
    )
    const polkassemblyService = beforeAllSetup(() =>
        app().get<PolkassemblyChildBountiesService>(PolkassemblyChildBountiesService),
    )
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
    describe('getBountyChildBountiesCount', () => {
        it('should call PolkassemblyChildBountiesService.getBountyChildBountiesIds with correct arguments', () => {
            const spy = jest.spyOn(polkassemblyService(), 'getBountyChildBountiesIds')
            service().getBountyChildBountiesCount(NETWORKS.POLKADOT, 0)
            expect(spy).toHaveBeenCalledWith(NETWORKS.POLKADOT, 0)
        })
        it('should call BlockchainChildBountiesService.getBountyChildBountiesIds with correct arguments', () => {
            const spy = jest.spyOn(blockchainChildBountiesService(), 'getBountyChildBountiesIds')
            service().getBountyChildBountiesCount(NETWORKS.POLKADOT, 0)
            expect(spy).toHaveBeenCalledWith(NETWORKS.POLKADOT, 0)
        })
    })

    describe('update', () => {
        beforeAll(() => {
            mockGetChildBounties(app().get(BlockchainChildBountiesService))
        })

        const setUpUpdate = async (blockchainChildBounty: BlockchainChildBountyDto = blockchainChildBounty4) => {
            const { user } = await createSessionData()
            const childBountyEntity = await createChildBountyEntity(service(), user, {
                blockchainIndex: blockchainChildBounty.index,
                parentBountyBlockchainIndex: blockchainChildBounty.parentIndex,
            })
            return {
                user,
                childBountyEntity,
            }
        }

        it('should return updated child bounty entity', async () => {
            const { user } = await setUp()
            const childBounty = await service().create(
                {
                    ...minimalValidCreateDto,
                    description: 'description',
                    blockchainIndex: 3,
                    parentBountyBlockchainIndex: 3,
                },
                user,
            )

            const updatedChildBounty = await service().update(
                {
                    parentBountyBlockchainIndex: childBounty.parentBountyBlockchainIndex,
                    blockchainIndex: childBounty.blockchainIndex,
                },
                childBounty.networkId,
                {
                    title: 'updated title',
                    description: 'updated description',
                },
                user,
            )

            expect(updatedChildBounty.entity!.title).toBe('updated title')
            expect(updatedChildBounty.entity!.description).toBe('updated description')
            expect(childBounty.id).toBe(updatedChildBounty.entity!.id)
        })

        it('should update child bounty entity', async () => {
            const { user } = await setUp()
            const childBounty = await service().create(
                {
                    ...minimalValidCreateDto,
                    description: 'description',
                    blockchainIndex: 3,
                    parentBountyBlockchainIndex: 3,
                },
                user,
            )

            await service().update(
                {
                    parentBountyBlockchainIndex: childBounty.parentBountyBlockchainIndex,
                    blockchainIndex: childBounty.blockchainIndex,
                },
                childBounty.networkId,
                {
                    title: 'updated title',
                    description: 'updated description',
                },
                user,
            )

            const saved = (await repository().findOne(childBounty.id))!

            expect(saved.title).toBe('updated title')
            expect(saved.description).toBe('updated description')
        })

        it('should create new entity if no entity', async () => {
            const curator = await createWeb3SessionData(blockchainChildBounty4.curator!)

            await service().update(
                {
                    parentBountyBlockchainIndex: blockchainChildBounty4.parentIndex,
                    blockchainIndex: blockchainChildBounty4.index,
                },
                NETWORKS.POLKADOT,
                {
                    title: 'updated title',
                    description: 'updated description',
                },
                curator.user,
            )

            const { entity } = await service().findOne(NETWORKS.POLKADOT, {
                parentBountyBlockchainIndex: blockchainChildBounty4.parentIndex,
                blockchainIndex: blockchainChildBounty4.index,
            })

            expect(entity).toMatchObject({
                ownerId: curator.user.id,
                title: 'updated title',
                description: 'updated description',
            })
        })

        it('should throw BadRequestException if no entity and no title in dto', async () => {
            const curator = await createWeb3SessionData(blockchainChildBounty4.curator!)
            const updateChildBounty = async () =>
                await service().update(
                    {
                        parentBountyBlockchainIndex: blockchainChildBounty4.parentIndex,
                        blockchainIndex: blockchainChildBounty4.index,
                    },
                    NETWORKS.POLKADOT,
                    {
                        description: 'updated description',
                    },
                    curator.user,
                )

            return expect(updateChildBounty).rejects.toThrow(BadRequestException)
        })

        it('should throw NotFoundException when no blockchain child bounty', async () => {
            const user = await createWeb3SessionData('14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3')
            const updateChildBounty = async () =>
                await service().update(
                    {
                        parentBountyBlockchainIndex: 99,
                        blockchainIndex: 99,
                    },
                    NETWORKS.POLKADOT,
                    {
                        description: 'updated description',
                        title: 'updated title',
                    },
                    user.user,
                )

            return expect(updateChildBounty).rejects.toThrow(NotFoundException)
        })

        describe('called by', () => {
            it('not owner, curator, should throw ForbiddenException', async () => {
                const { childBountyEntity } = await setUpUpdate()
                const otherUser = await createWeb3SessionData('12TpXjttC29ZBEwHqdmbEtXJ9JSR9NZm2nxsrMwfXUHoxX6U')

                return expect(
                    service().update(
                        {
                            parentBountyBlockchainIndex: childBountyEntity.parentBountyBlockchainIndex,
                            blockchainIndex: childBountyEntity.blockchainIndex,
                        },
                        NETWORKS.POLKADOT,
                        {
                            description: 'updated description',
                        },
                        otherUser.user,
                    ),
                ).rejects.toThrow(ForbiddenException)
            })

            it('owner should resolve', async () => {
                const { user, childBountyEntity } = await setUpUpdate()

                return expect(
                    service().update(
                        {
                            parentBountyBlockchainIndex: childBountyEntity.parentBountyBlockchainIndex,
                            blockchainIndex: childBountyEntity.blockchainIndex,
                        },
                        NETWORKS.POLKADOT,
                        {
                            description: 'updated description',
                        },
                        user,
                    ),
                ).resolves.toBeDefined()
            })

            it('curator should resolve when has curator and active', async () => {
                const curator = await createWeb3SessionData(blockchainChildBountyActive.curator!)
                const { childBountyEntity } = await setUpUpdate()

                return expect(
                    service().update(
                        {
                            parentBountyBlockchainIndex: childBountyEntity.parentBountyBlockchainIndex,
                            blockchainIndex: childBountyEntity.blockchainIndex,
                        },
                        childBountyEntity.networkId,
                        {},
                        curator.user,
                    ),
                ).resolves.toBeDefined()
            })

            it('curator should throw ForbiddenException when no curator', async () => {
                const { childBountyEntity } = await setUpUpdate(blockchainChildBountyNoCurator)
                const curator = await createWeb3SessionData('12TpXjttC29ZBEwHqdmbEtXJ9JSR9NZm2nxsrMwfXUHoxX6U')

                return expect(
                    service().update(
                        {
                            parentBountyBlockchainIndex: childBountyEntity.parentBountyBlockchainIndex,
                            blockchainIndex: childBountyEntity.blockchainIndex,
                        },
                        childBountyEntity.networkId,
                        {},
                        curator.user,
                    ),
                ).rejects.toThrow(ForbiddenException)
            })
        })
    })
})
