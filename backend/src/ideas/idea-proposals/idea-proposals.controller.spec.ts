import { HttpStatus } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler,
} from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { UpdateExtrinsicDto } from '../../extrinsics/dto/updateExtrinsic.dto'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../../utils/spec.helpers'
import { IdeaEntity } from '../entities/idea.entity'
import { createIdea } from '../spec.helpers'
import { IdeasService } from '../ideas.service'
import { IdeaNetworkEntity } from '../entities/idea-network.entity'
import { NetworkPlanckValue } from '../../utils/types'

const updateExtrinsicDto: UpdateExtrinsicDto = {
    blockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
    events: [
        {
            section: 'treasury',
            method: 'Proposed',
            data: [
                {
                    name: 'ProposalIndex',
                    value: '3',
                },
            ],
        },
    ],
} as UpdateExtrinsicDto

const createIdeaProposalDto = (ideaNetworkId: string) => {
    return {
        ideaNetworkId,
        extrinsicHash: '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
        lastBlockHash: '0x74a566a72b3fdb19b766e2a8cfbee63388e56fb58edd48bce71e6177325ef13f',
    }
}

const baseUrl = (ideaId: string) => `/api/v1/ideas/${ideaId}/proposals`

describe(`/api/v1/ideas/:id/proposals`, () => {
    const app = beforeSetupFullApp()

    const ideasService = beforeAllSetup(() => app().get<IdeasService>(IdeasService))
    const blockchainService = beforeAllSetup(() => app().get<BlockchainService>(BlockchainService))

    let verifiedUserSessionHandler: SessionHandler

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()

        verifiedUserSessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
    })

    describe('POST', () => {
        let idea: IdeaEntity

        beforeAll(() => {
            jest.spyOn(blockchainService(), 'listenForExtrinsic').mockImplementation(
                async (
                    networkId: string,
                    extrinsicHash: string,
                    cb: (updateExtrinsicDto: UpdateExtrinsicDto) => Promise<void>,
                ) => {
                    await cb(updateExtrinsicDto)
                },
            )
        })

        afterAll(() => {
            jest.clearAllMocks()
        })

        beforeEach(async () => {
            idea = await createIdea(
                {
                    beneficiary: '14MBCttARciF9RZGW447KuLvjVtvJn8UQF3KJKHDtjW1ENT6',
                    networks: [{ name: NETWORKS.POLKADOT, value: '100' as NetworkPlanckValue }],
                },
                verifiedUserSessionHandler.sessionData,
                ideasService(),
            )
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            return request(app())
                .post(baseUrl(idea.id))
                .send(createIdeaProposalDto(idea.networks[0].id))
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const notVerifiedUserSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')

            return notVerifiedUserSessionHandler
                .authorizeRequest(
                    request(app()).post(baseUrl(idea.id)).send(createIdeaProposalDto(idea.networks[0].id)),
                )
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for undefined request body`, () => {
            return verifiedUserSessionHandler
                .authorizeRequest(request(app()).post(baseUrl(idea.id)).send(undefined))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.ACCEPTED} for all valid data`, async () => {
            return verifiedUserSessionHandler
                .authorizeRequest(
                    request(app()).post(baseUrl(idea.id)).send(createIdeaProposalDto(idea.networks[0].id)),
                )
                .expect(HttpStatus.ACCEPTED)
        })

        it('should return idea network with created extrinsic', async () => {
            const result = await verifiedUserSessionHandler.authorizeRequest(
                request(app()).post(baseUrl(idea.id)).send(createIdeaProposalDto(idea.networks[0].id)),
            )

            const body = result.body as IdeaNetworkEntity

            expect(body.name).toBe(NETWORKS.POLKADOT)
            expect(body.value).toBe('100')
            expect(body.extrinsic).toBeDefined()
            expect(body.extrinsic!.extrinsicHash).toBe(
                '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
            )
            expect(body.extrinsic!.lastBlockHash).toBe(
                '0x74a566a72b3fdb19b766e2a8cfbee63388e56fb58edd48bce71e6177325ef13f',
            )
        })
    })
})
