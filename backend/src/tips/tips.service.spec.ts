import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../utils/spec.helpers'
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
import { createWeb3SessionData } from '../ideas/spec.helpers'

describe(`TipsService`, () => {
    const app = beforeSetupFullApp()
    const aliceAddress = '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5'
    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const charlieAddress = '14Gjs1TD93gnwEBfDMHoCgsuf1s2TVKUP6Z1qKmAZnZ8cW5q'
    const daveAddress = '126TwBzBM4jUEK2gTphmW4oLoBWWnYvPp8hygmduTr4uds57'

    const tipService = beforeAllSetup(() => app().get<TipsService>(TipsService))
    const blockchainTipService = beforeAllSetup(() => app().get<BlockchainTipsService>(BlockchainTipsService))
    const tipRepository = beforeAllSetup(() => app().get<Repository<TipEntity>>(getRepositoryToken(TipEntity)))

    const setUpEntityTip = (tip: Partial<TipEntity>, user: UserEntity) => {
        return tipRepository().save(
            tipRepository().create({
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
        it('should return on-chain tip WITHOUT entity and detailed public used data for finder and beneficiary', async () => {
            const expectedBlockchainTip = {
                hash: '0x0',
                reason: 'reason',
                who: bobAddress,
                finder: charlieAddress,
                deposit: '1' as NetworkPlanckValue,
                closes: null,
                tips: [{ tipper: daveAddress, value: '1' as NetworkPlanckValue }],
                findersFee: false,
            }
            setUpBlockchainTips([expectedBlockchainTip])

            const { items, total } = await tipService().find(
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
                hash: '0x0',
                reason: 'reason',
                who: bobAddress,
                finder: charlieAddress,
                deposit: '1' as NetworkPlanckValue,
                closes: null,
                tips: [{ tipper: daveAddress, value: '1' as NetworkPlanckValue }],
                findersFee: false,
            }
            setUpBlockchainTips([expectedBlockchainTip])

            const { items, total } = await tipService().find(
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

        it('should return off-chain tip', async () => {
            // TODO: TREAS-453 implement proper test
            const { items, total } = await tipService().find(
                NETWORKS.POLKADOT,
                { timeFrame: TimeFrame.History },
                new PaginatedParams({}),
            )
            expect(total).toBe(0)
            expect(items).toHaveLength(0)
        })
    })
})
