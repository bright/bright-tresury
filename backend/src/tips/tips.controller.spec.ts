import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../utils/spec.helpers'
import { HttpStatus } from '@nestjs/common'
import { TipsService } from './tips.service'
import { NetworkPlanckValue, Nil } from '../utils/types'
import BN from 'bn.js'
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { TipFilterQuery } from './tip-filter.query'
import { PublicUserDto } from '../users/dto/public-user.dto'

const baseUrl = `/api/v1/tips/`

describe(`/api/v1/tips/`, () => {
    const app = beforeSetupFullApp()
    const service = beforeAllSetup(() => app().get<TipsService>(TipsService))
    beforeEach(async () => {
        await cleanDatabase()
    })

    describe('GET', () => {
        it(`should response with status code ${HttpStatus.OK}`, async () => {
            return request(app()).get(`${baseUrl}?network=${NETWORKS.POLKADOT}`).expect(HttpStatus.OK)
        })
        it(`should return ${HttpStatus.BAD_REQUEST} for not given network name`, () => {
            return request(app()).get(baseUrl).expect(HttpStatus.BAD_REQUEST)
        })
        it('should return tips for given network', async () => {
            jest.spyOn(service(), 'find').mockImplementation(async () =>
                Promise.resolve({
                    items: [
                        {
                            blockchain: {
                                hash: '0x0',
                                reason: 'reason',
                                who: '0x1',
                                finder: '0x2',
                                deposit: '1' as NetworkPlanckValue,
                                closes: null,
                                tips: [
                                    {
                                        tipper: '0x3',
                                        value: '1' as NetworkPlanckValue,
                                    },
                                ],
                                findersFee: false,
                            },
                            entity: null,
                            finder: new PublicUserDto({ web3address: '0x2' }),
                            beneficiary: new PublicUserDto({ web3address: '0x1' }),
                        },
                    ],
                    total: 1,
                }),
            )
            const result = await request(app()).get(`${baseUrl}?network=${NETWORKS.POLKADOT}`)
            const { items, total } = result.body
            expect(total).toBe(1)
            expect(items).toHaveLength(1)
        })
    })
})
