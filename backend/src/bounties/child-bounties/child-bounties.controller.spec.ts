import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../../utils/spec.helpers'
import { ChildBountiesService } from './child-bounties.service'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { HttpStatus } from '@nestjs/common'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
} from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { minimalValidCreateDto } from './spec.helpers'

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
