import { BlockchainService } from '../blockchain/blockchain.service'
import { ExtrinsicsService } from '../extrinsics/extrinsics.service'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../utils/spec.helpers'
import {
    aliceAddress,
    bobAddress,
    charlieAddress,
    daveAddress,
    minimalValidListenForTipDto,
    mockListenForExtrinsic,
    mockListenForExtrinsicWithNoEvent,
    validBlockchainTip,
} from './spec.helpers'
import { TipsService } from './tips.service'
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { TimeFrame } from '../utils/time-frame.query'
import { BlockchainTipsService } from '../blockchain/blockchain-tips/blockchain-tips.service'
import { NetworkPlanckValue } from '../utils/types'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { TipEntity } from './tip.entity'
import { UserEntity } from '../users/entities/user.entity'
import { BlockchainTipDto } from '../blockchain/blockchain-tips/dto/blockchain-tip.dto'
import { createUserEntity, createWeb3SessionData } from '../ideas/spec.helpers'
import { TipStatus } from './dto/find-tip.dto'
import { BlockNumber } from '@polkadot/types/interfaces'
import BN from 'bn.js'

describe(`TipsService`, () => {
    const app = beforeSetupFullApp()

    const tipsService = beforeAllSetup(() => app().get<TipsService>(TipsService))
    const blockchainTipService = beforeAllSetup(() => app().get<BlockchainTipsService>(BlockchainTipsService))
    const blockchainService = beforeAllSetup(() => app().get<BlockchainService>(BlockchainService))
    const extrinsicsService = beforeAllSetup(() => app().get<ExtrinsicsService>(ExtrinsicsService))
    const tipsRepository = beforeAllSetup(() => app().get<Repository<TipEntity>>(getRepositoryToken(TipEntity)))

    const setUpEntityTip = (tip: Partial<TipEntity>, user: UserEntity) => {
        return tipsRepository().save(
            tipsRepository().create({
                networkId: NETWORKS.POLKADOT,
                blockchainHash: '0x0',
                title: 'entity title',
                description: 'entity description',
                owner: user,
                ...tip,
            }),
        )
    }
    const setUpBlockchainTips = (tips: Partial<BlockchainTipDto>[]) => {
        jest.spyOn(blockchainTipService(), 'getTips').mockImplementation(async () =>
            tips.map((partialTip, index) => ({
                hash: partialTip.hash ?? `0x${index}`,
                reason: partialTip.reason ?? `reason ${index}`,
                who: partialTip.who ?? bobAddress,
                finder: partialTip.finder ?? charlieAddress,
                deposit: partialTip.deposit ?? (index.toString() as NetworkPlanckValue),
                closes: partialTip.closes ?? null,
                tips: partialTip.tips ?? [],
                findersFee: partialTip.findersFee ?? false,
            })),
        )
    }
    beforeEach(async () => {
        await cleanDatabase()
        jest.clearAllMocks()
    })

    describe('find', () => {
        it('should return on-chain tip WITHOUT entity and detailed public user data for finder and beneficiary', async () => {
            const expectedBlockchainTip = {
                ...validBlockchainTip,
                who: bobAddress,
                finder: charlieAddress,
                tips: [{ tipper: daveAddress, value: '1' as NetworkPlanckValue }],
                findersFee: false,
            }
            setUpBlockchainTips([expectedBlockchainTip])

            const { items, total } = await tipsService().find(
                NETWORKS.POLKADOT,
                { timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            )
            expect(total).toBe(1)
            expect(items).toHaveLength(1)

            const [actual] = items
            expect(actual.blockchain).toMatchObject(expectedBlockchainTip)
            expect(actual.entity).toBeUndefined()
            expect(actual.people.get(bobAddress)).toMatchObject({ web3address: bobAddress })
            expect(actual.people.get(charlieAddress)).toMatchObject({ web3address: charlieAddress })
            expect(actual.people.get(daveAddress)).toMatchObject({ web3address: daveAddress })
        })
        it('should return on-chain tip WITH entity and detailed public used data for finder and beneficiary', async () => {
            const { user: alice } = await createWeb3SessionData(aliceAddress)
            const { user: bob } = await createWeb3SessionData(bobAddress)
            const { user: charlie } = await createWeb3SessionData(charlieAddress)
            const { user: dave } = await createWeb3SessionData(daveAddress)

            const expectedEntityTip = await setUpEntityTip({ blockchainHash: '0x0' }, alice)

            const expectedBlockchainTip = {
                ...validBlockchainTip,
                who: bobAddress,
                finder: charlieAddress,
                tips: [{ tipper: daveAddress, value: '1' as NetworkPlanckValue }],
                findersFee: false,
            }
            setUpBlockchainTips([expectedBlockchainTip])

            const { items, total } = await tipsService().find(
                NETWORKS.POLKADOT,
                { timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            )
            expect(total).toBe(1)
            expect(items).toHaveLength(1)

            const [actual] = items
            expect(actual.blockchain).toMatchObject(expectedBlockchainTip)
            expect(actual.entity).toMatchObject(expectedEntityTip)
            expect(actual.people.get(bobAddress)).toMatchObject({ username: bob.username, web3address: bobAddress })
            expect(actual.people.get(charlieAddress)).toMatchObject({
                username: charlie.username,
                web3address: charlieAddress,
            })
            expect(actual.people.get(daveAddress)).toMatchObject({ username: dave.username, web3address: daveAddress })
        })

        it(`should return tip with ${TipStatus.Proposed} status`, async () => {
            setUpBlockchainTips([
                {
                    ...validBlockchainTip,
                    closes: null,
                    tips: [],
                },
            ])
            const { items } = await tipsService().find(
                NETWORKS.POLKADOT,
                { timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            )
            const [actual] = items
            expect(actual.status).toBe(TipStatus.Proposed)
        })

        it(`should return tip with ${TipStatus.Tipped} status`, async () => {
            setUpBlockchainTips([
                {
                    ...validBlockchainTip,
                    closes: null,
                    tips: [{ tipper: daveAddress, value: '1' as NetworkPlanckValue }],
                },
            ])

            const { items } = await tipsService().find(
                NETWORKS.POLKADOT,
                { timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            )
            const [actual] = items
            expect(actual.status).toBe(TipStatus.Tipped)
        })
        it(`should return tip with ${TipStatus.Closing} status`, async () => {
            setUpBlockchainTips([
                {
                    ...validBlockchainTip,
                    closes: new BN(1) as BlockNumber,
                    tips: [{ tipper: daveAddress, value: '1' as NetworkPlanckValue }],
                },
            ])
            jest.spyOn(blockchainService(), 'getCurrentBlockNumber').mockImplementation(
                async () => new BN(2) as BlockNumber,
            )
            const { items } = await tipsService().find(
                NETWORKS.POLKADOT,
                { timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            )
            const [actual] = items
            expect(actual.status).toBe(TipStatus.Closing)
        })

        it(`should return tip with ${TipStatus.PendingPayout} status`, async () => {
            setUpBlockchainTips([
                {
                    ...validBlockchainTip,
                    closes: new BN(1) as BlockNumber,
                    tips: [{ tipper: daveAddress, value: '1' as NetworkPlanckValue }],
                },
            ])
            jest.spyOn(blockchainService(), 'getCurrentBlockNumber').mockImplementation(
                async () => new BN(0) as BlockNumber,
            )

            const { items } = await tipsService().find(
                NETWORKS.POLKADOT,
                { timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            )
            const [actual] = items
            expect(actual.status).toBe(TipStatus.PendingPayout)
        })

        it('should return off-chain tip', async () => {
            // TODO: TREAS-453 implement proper test
            const { items, total } = await tipsService().find(
                NETWORKS.POLKADOT,
                { timeFrame: TimeFrame.History },
                new PaginatedParams({}),
            )
            expect(total).toBe(0)
            expect(items).toHaveLength(0)
        })
    })

    describe('create', () => {
        it('should return created tip entity', async () => {
            const user = await createUserEntity()

            const result = await tipsService().create(
                {
                    title: 'title',
                    description: 'description',
                    networkId: NETWORKS.POLKADOT,
                    blockchainHash: '0x0',
                },
                user,
            )

            expect(result).toMatchObject({
                title: 'title',
                description: 'description',
                networkId: NETWORKS.POLKADOT,
                blockchainHash: '0x0',
                owner: expect.objectContaining({ id: user.id }),
            })
        })

        it('should create tip entity', async () => {
            const user = await createUserEntity()

            const result = await tipsService().create(
                {
                    title: 'title',
                    description: 'description',
                    networkId: NETWORKS.POLKADOT,
                    blockchainHash: '0x0',
                },
                user,
            )

            const saved = (await tipsRepository().findOne(result.id))!

            expect(saved).toMatchObject({
                title: 'title',
                description: 'description',
                networkId: NETWORKS.POLKADOT,
                blockchainHash: '0x0',
                owner: expect.objectContaining({ id: user.id }),
            })
        })
    })

    describe('listenForNewTipExtrinsic', () => {
        beforeAll(() => {
            mockListenForExtrinsic(blockchainService())
        })

        it('should call listenForExtrinsic method', async () => {
            const user = await createUserEntity()
            const spy = jest.spyOn(extrinsicsService(), 'listenForExtrinsic')

            await tipsService().listenForNewTipExtrinsic(minimalValidListenForTipDto, user)

            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(
                minimalValidListenForTipDto.networkId,
                {
                    extrinsicHash: minimalValidListenForTipDto.extrinsicHash,
                    lastBlockHash: minimalValidListenForTipDto.lastBlockHash,
                    data: minimalValidListenForTipDto,
                },
                expect.anything(),
            )
        })

        it('should return extrinsic', async () => {
            const user = await createUserEntity()

            const result = await tipsService().listenForNewTipExtrinsic(minimalValidListenForTipDto, user)
            expect(result).toBeDefined()
            expect(result.extrinsicHash).toBe(minimalValidListenForTipDto.extrinsicHash)
            expect(result.lastBlockHash).toBe(minimalValidListenForTipDto.lastBlockHash)
            expect(result.data).toStrictEqual(minimalValidListenForTipDto)
        })

        it('should call create tip method when extrinsic with NewTip event', async () => {
            const user = await createUserEntity()
            const spy = jest.spyOn(tipsService(), 'create')

            await tipsService().listenForNewTipExtrinsic(minimalValidListenForTipDto, user)

            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(
                {
                    ...minimalValidListenForTipDto,
                    blockchainHash: '0x2c3f6dcddab44cf56b5466182f7b3a6f94b455f7b61175a13d61d905138b35ce',
                },
                expect.objectContaining({ id: user.id }),
            )
        })

        it('should not call create tip method when extrinsic with no NewTip event', async () => {
            await mockListenForExtrinsicWithNoEvent(blockchainService())
            const user = await createUserEntity()
            const spy = jest.spyOn(tipsService(), 'create')

            await tipsService().listenForNewTipExtrinsic(minimalValidListenForTipDto, user)

            expect(spy).not.toHaveBeenCalled()
        })
    })
})
