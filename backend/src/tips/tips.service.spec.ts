import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../utils/spec.helpers'
import { TipsService } from './tips.service'
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { TimeFrame } from '../utils/time-frame.query'
import { BlockchainTipsService } from '../blockchain/blockchain-tips/blockchain-tips.service'
import { NetworkPlanckValue } from '../utils/types'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { TipEntity } from './tip.entity'
import { createSessionData } from '../ideas/spec.helpers'

describe(`TipsService`, () => {
    const app = beforeSetupFullApp()

    const tipService = beforeAllSetup(() => app().get<TipsService>(TipsService))
    const blockchainTipService = beforeAllSetup(() => app().get<BlockchainTipsService>(BlockchainTipsService))
    const repository = beforeAllSetup(() => app().get<Repository<TipEntity>>(getRepositoryToken(TipEntity)))

    beforeEach(async () => {
        await cleanDatabase()
    })

    describe('find', () => {
        it('should return on-chain tip', async () => {
            const { user } = await createSessionData({ web3Addresses: [] })
            const entityTip = repository().save(
                repository().create({
                    networkId: NETWORKS.POLKADOT,
                    blockchainHash: '0x0',
                    title: 'entity title',
                    description: 'entity description',
                    owner: user,
                }),
            )

            const blockchainTip = {
                hash: '0x0',
                reason: 'reason',
                who: '0x1',
                finder: '0x2',
                deposit: '1' as NetworkPlanckValue,
                closes: null,
                tips: [],
                findersFee: false,
            }
            jest.spyOn(blockchainTipService(), 'getTips').mockImplementation(async () => [blockchainTip])

            const { items, total } = await tipService().find(
                NETWORKS.POLKADOT,
                { timeFrame: TimeFrame.OnChain },
                new PaginatedParams({}),
            )
            expect(total).toBe(1)
            expect(items).toHaveLength(1)
            const [actual] = items
            expect(actual.blockchain).toMatchObject(blockchainTip)
            expect(actual.entity).toMatchObject(entityTip)
        })
    })
})
