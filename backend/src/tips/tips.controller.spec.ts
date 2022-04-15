import { HttpStatus } from '@nestjs/common'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler,
} from '../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainService } from '../blockchain/blockchain.service'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../utils/spec.helpers'
import {
    bobAddress,
    charlieAddress,
    daveAddress,
    minimalValidListenForTipDto,
    mockListenForExtrinsic,
    validBlockchainTip,
} from './spec.helpers'
import { TipsService } from './tips.service'
import { FindTipDto, TipStatus } from './dto/find-tip.dto'
import { PublicUserDto } from '../users/dto/public-user.dto'

const baseUrl = `/api/v1/tips/`

describe(`/api/v1/tips/`, () => {
    const app = beforeSetupFullApp()
    const service = beforeAllSetup(() => app().get<TipsService>(TipsService))
    const blockchainService = beforeAllSetup(() => app().get<BlockchainService>(BlockchainService))

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('GET', () => {
        it(`should response with status code ${HttpStatus.OK}`, async () => {
            return request(app()).get(`${baseUrl}?network=${NETWORKS.POLKADOT}`).expect(HttpStatus.OK)
        })
        it(`should return ${HttpStatus.BAD_REQUEST} for not given network name`, () => {
            return request(app()).get(baseUrl).expect(HttpStatus.BAD_REQUEST)
        })
        it('should return tips for given network', async () => {
            jest.spyOn(service(), 'find').mockImplementation(async () => ({
                items: [
                    new FindTipDto(
                        validBlockchainTip,
                        null,
                        new Map([
                            [bobAddress, new PublicUserDto({ web3address: bobAddress })],
                            [charlieAddress, new PublicUserDto({ web3address: charlieAddress })],
                        ]),
                        TipStatus.Proposed,
                    ),
                ],
                total: 1,
            }))
            const result = await request(app()).get(`${baseUrl}?network=${NETWORKS.POLKADOT}`)
            const { items, total } = result.body
            expect(total).toBe(1)
            expect(items).toHaveLength(1)
        })
        it(`should return ${HttpStatus.BAD_REQUEST} for request with wrong status option`, async () => {
            return request(app())
                .get(`${baseUrl}?network=${NETWORKS.POLKADOT}&status=xyz`)
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for request with wrong owner id`, async () => {
            return request(app())
                .get(`${baseUrl}?network=${NETWORKS.POLKADOT}&ownerId=xyz`)
                .expect(HttpStatus.BAD_REQUEST)
        })
    })

    describe('POST', () => {
        beforeAll(() => {
            mockListenForExtrinsic(blockchainService())
        })

        const setUp = async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            return { sessionHandler }
        }

        const assertThatThrowsBadRequestForWrongDataSend = async (sessionHandler: SessionHandler, dto: any) => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({ ...minimalValidListenForTipDto, ...dto }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        }

        it(`should return ${HttpStatus.ACCEPTED} for minimal valid data`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(request(app()).post(baseUrl).send(minimalValidListenForTipDto))
                .expect(HttpStatus.ACCEPTED)
        })

        it('should return extrinsic with data', async () => {
            const { sessionHandler } = await setUp()
            const { body } = await sessionHandler.authorizeRequest(
                request(app()).post(baseUrl).send(minimalValidListenForTipDto),
            )
            expect(body).toMatchObject({
                lastBlockHash: minimalValidListenForTipDto.lastBlockHash,
                extrinsicHash: minimalValidListenForTipDto.extrinsicHash,
                data: minimalValidListenForTipDto,
            })
        })

        it(`should call listenForNewTipExtrinsic method of tips service`, async () => {
            const { sessionHandler } = await setUp()
            const spy = jest.spyOn(service(), 'listenForNewTipExtrinsic')
            await sessionHandler.authorizeRequest(request(app()).post(baseUrl).send(minimalValidListenForTipDto))
            expect(spy).toHaveBeenCalledWith(
                minimalValidListenForTipDto,
                expect.objectContaining({ id: sessionHandler.sessionData.user.id }),
            )
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no blockchain description`, async () => {
            const { sessionHandler } = await setUp()
            return assertThatThrowsBadRequestForWrongDataSend(sessionHandler, {
                blockchainReason: undefined,
            })
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no title`, async () => {
            const { sessionHandler } = await setUp()
            return assertThatThrowsBadRequestForWrongDataSend(sessionHandler, {
                title: undefined,
            })
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no extrinsicHash`, async () => {
            const { sessionHandler } = await setUp()
            return assertThatThrowsBadRequestForWrongDataSend(sessionHandler, {
                extrinsicHash: undefined,
            })
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no lastBlockHash`, async () => {
            const { sessionHandler } = await setUp()
            return assertThatThrowsBadRequestForWrongDataSend(sessionHandler, {
                lastBlockHash: undefined,
            })
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no finder`, async () => {
            const { sessionHandler } = await setUp()
            return assertThatThrowsBadRequestForWrongDataSend(sessionHandler, {
                finder: undefined,
            })
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no beneficiary`, async () => {
            const { sessionHandler } = await setUp()
            return assertThatThrowsBadRequestForWrongDataSend(sessionHandler, {
                beneficiary: undefined,
            })
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no networkId`, async () => {
            const { sessionHandler } = await setUp()
            return assertThatThrowsBadRequestForWrongDataSend(sessionHandler, {
                networkId: undefined,
            })
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid networkId`, async () => {
            const { sessionHandler } = await setUp()
            return assertThatThrowsBadRequestForWrongDataSend(sessionHandler, {
                networkId: 'not_valid',
            })
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            return request(app()).post(baseUrl).send(minimalValidListenForTipDto).expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const notVerifiedUserSessionHandler = await createUserSessionHandler(app())

            return notVerifiedUserSessionHandler
                .authorizeRequest(request(app()).post(baseUrl).send(minimalValidListenForTipDto))
                .expect(HttpStatus.FORBIDDEN)
        })
    })
})
