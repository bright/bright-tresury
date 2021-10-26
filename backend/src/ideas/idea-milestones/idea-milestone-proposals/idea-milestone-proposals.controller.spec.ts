import { HttpStatus } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { cleanAuthorizationDatabase } from '../../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler,
} from '../../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainService } from '../../../blockchain/blockchain.service'
import { UpdateExtrinsicDto } from '../../../extrinsics/dto/updateExtrinsic.dto'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../../../utils/spec.helpers'
import { Idea } from '../../entities/idea.entity'
import { IdeasService } from '../../ideas.service'
import { createIdea, createIdeaMilestone } from '../../spec.helpers'
import { IdeaMilestoneNetworkDto } from '../dto/idea-milestone-network.dto'
import { IdeaMilestonesService } from '../idea-milestones.service'
import { IdeaMilestoneNetworkStatus } from '../entities/idea-milestone-network-status'
import { NetworkPlanckValue } from '../../../NetworkPlanckValue'

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

const createIdeaMilestoneProposalDto = (ideaMilestoneNetworkId: string) => {
    return {
        ideaMilestoneNetworkId,
        extrinsicHash: '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
        lastBlockHash: '0x74a566a72b3fdb19b766e2a8cfbee63388e56fb58edd48bce71e6177325ef13f',
    }
}

const createIdeaMilestoneDto = (
    networkValue: NetworkPlanckValue = '100' as NetworkPlanckValue,
    beneficiary: string = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
) => {
    return {
        networks: [{ name: NETWORKS.POLKADOT, value: networkValue, status: IdeaMilestoneNetworkStatus.Active }],
        beneficiary,
        details: {
            subject: 'subject',
        },
    }
}
const baseUrl = (ideaId: string, ideaMilestoneId: string) =>
    `/api/v1/ideas/${ideaId}/milestones/${ideaMilestoneId}/proposals`

describe('/api/v1/ideas/:ideaId/milestones/:ideaMilestoneId/proposals', () => {
    const app = beforeSetupFullApp()

    const ideasService = beforeAllSetup(() => app().get<IdeasService>(IdeasService))
    const ideaMilestonesService = beforeAllSetup(() => app.get().get<IdeaMilestonesService>(IdeaMilestonesService))
    const blockchainService = beforeAllSetup(() => app().get<BlockchainService>(BlockchainService))

    let verifiedUserSessionHandler: SessionHandler

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()

        verifiedUserSessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
    })

    describe('POST', () => {
        let idea: Idea

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
                    beneficiary: uuid(),
                },
                verifiedUserSessionHandler.sessionData,
                ideasService(),
            )
        })

        it(`should return ${HttpStatus.ACCEPTED} for all valid data`, async () => {
            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                verifiedUserSessionHandler.sessionData,
                ideaMilestonesService(),
            )

            return verifiedUserSessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id, ideaMilestone.id))
                        .send(createIdeaMilestoneProposalDto(ideaMilestone.networks[0].id)),
                )
                .expect(HttpStatus.ACCEPTED)
        })

        it('should return idea milestone network with created extrinsic', async () => {
            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                verifiedUserSessionHandler.sessionData,
                ideaMilestonesService(),
            )

            const result = await verifiedUserSessionHandler.authorizeRequest(
                request(app())
                    .post(baseUrl(idea.id, ideaMilestone.id))
                    .send(createIdeaMilestoneProposalDto(ideaMilestone.networks[0].id)),
            )

            const body = result.body as IdeaMilestoneNetworkDto

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

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                verifiedUserSessionHandler.sessionData,
                ideaMilestonesService(),
            )

            return request(app())
                .post(baseUrl(idea.id, ideaMilestone.id))
                .send(createIdeaMilestoneProposalDto(ideaMilestone.networks[0].id))
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const notVerifiedUserSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')

            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                verifiedUserSessionHandler.sessionData,
                ideaMilestonesService(),
            )

            return notVerifiedUserSessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id, ideaMilestone.id))
                        .send(createIdeaMilestoneProposalDto(ideaMilestone.networks[0].id)),
                )
                .expect(HttpStatus.FORBIDDEN)
        })
    })
})
