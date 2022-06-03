import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../../utils/spec.helpers'
import { ChildBountiesService } from './child-bounties.service'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { HttpStatus } from '@nestjs/common'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
} from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { minimalValidCreateDto } from './spec.helpers'
import { FindChildBountyDto } from './dto/find-child-bounty.dto'
import { NetworkPlanckValue, Nil } from '../../utils/types'
import { BlockchainChildBountyStatus } from '../../blockchain/blockchain-child-bounties/dto/blockchain-child-bounty.dto'

const baseUrl = (bountyId: any) => `/api/v1/bounties/${bountyId}/child-bounties`

describe(`/api/v1/bounties/:bountyIndex/childBounties`, () => {
    const app = beforeSetupFullApp()
    const childBountiesService = beforeAllSetup(() => app().get<ChildBountiesService>(ChildBountiesService))

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe('GET', () => {
        beforeAll(() => {
            jest.spyOn(childBountiesService(), 'findByParentBountyBlockchainIndex').mockImplementation(
                async (networkId, parentBountyBlockchainIndex) => {
                    return Promise.resolve([
                        {
                            blockchain: {
                                index: 0,
                                parentIndex: 0,
                                description: 'bc-description-0',
                                value: '10' as NetworkPlanckValue,
                                fee: '1' as NetworkPlanckValue,
                                curator: undefined,
                                curatorDeposit: '0' as NetworkPlanckValue,
                                beneficiary: undefined,
                                unlockAt: undefined,
                                status: BlockchainChildBountyStatus.Added,
                            },
                        },
                    ])
                },
            )
        })

        it('should return child bounties', async () => {
            const { body: childBountiesDtos } = await request(app()).get(`${baseUrl(0)}?network=${NETWORKS.POLKADOT}`)
            expect(Array.isArray(childBountiesDtos)).toBe(true)
            expect(childBountiesDtos).toHaveLength(1)
            const [childBountyDto] = childBountiesDtos
            expect(childBountyDto).toMatchObject({
                blockchainIndex: 0,
                parentBountyBlockchainIndex: 0,
                blockchainDescription: 'bc-description-0',
                value: '10',
                curatorFee: '1',
                curatorDeposit: '0',
                status: BlockchainChildBountyStatus.Added,
            })
        })
        it(`should return ${HttpStatus.BAD_REQUEST} for no networkId`, async () => {
            return request(app()).get(baseUrl(0)).expect(HttpStatus.BAD_REQUEST)
        })
        it(`should return ${HttpStatus.BAD_REQUEST} for not valid networkId`, async () => {
            return request(app())
                .get(`${baseUrl(0)}?network=non-existing`)
                .expect(HttpStatus.BAD_REQUEST)
        })
    })

    describe('POST', () => {
        const setUp = async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            return { sessionHandler }
        }

        it(`should return ${HttpStatus.ACCEPTED} for minimal valid data`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(request(app()).post(baseUrl(0)).send(minimalValidCreateDto))
                .expect(HttpStatus.ACCEPTED)
        })

        it('should call listenForAddedChildBountyExtrinsic method of child-bounty service', async () => {
            const { sessionHandler } = await setUp()
            const spy = jest.spyOn(childBountiesService(), 'listenForAddedChildBountyExtrinsic')
            await sessionHandler.authorizeRequest(request(app()).post(baseUrl(0)).send(minimalValidCreateDto))
            expect(spy).toHaveBeenCalledWith(
                minimalValidCreateDto,
                0,
                expect.objectContaining({ id: sessionHandler.sessionData.user.id }),
            )
        })
        it('should return extrinsic with data', async () => {
            const { sessionHandler } = await setUp()
            const { body } = await sessionHandler.authorizeRequest(
                request(app()).post(baseUrl(0)).send(minimalValidCreateDto),
            )
            expect(body.lastBlockHash).toBe(minimalValidCreateDto.lastBlockHash)
            expect(body.extrinsicHash).toBe(minimalValidCreateDto.extrinsicHash)
            expect(body.data).toStrictEqual(minimalValidCreateDto)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for when no title`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(0))
                        .send({
                            ...minimalValidCreateDto,
                            title: undefined,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no extrinsicHash`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(0))
                        .send({
                            ...minimalValidCreateDto,
                            extrinsicHash: undefined,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no lastBlockHash`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(0))
                        .send({
                            ...minimalValidCreateDto,
                            lastBlockHash: undefined,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no networkId`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(0))
                        .send({
                            ...minimalValidCreateDto,
                            networkId: undefined,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid networkId`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(0))
                        .send({
                            ...minimalValidCreateDto,
                            networkId: 'not_valid',
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized users`, async () => {
            return request(app()).post(baseUrl(0)).send({}).expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const notVerifiedUserSessionHandler = await createUserSessionHandler(app())

            return notVerifiedUserSessionHandler
                .authorizeRequest(request(app()).post(baseUrl(0)).send(minimalValidCreateDto))
                .expect(HttpStatus.FORBIDDEN)
        })
    })
})
