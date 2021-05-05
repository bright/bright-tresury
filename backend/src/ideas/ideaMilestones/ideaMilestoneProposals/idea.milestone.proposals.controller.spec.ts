import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, request } from '../../../utils/spec.helpers'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler,
} from '../../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { cleanAuthorizationDatabase } from '../../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createIdea, createIdeaMilestone, createIdeaMilestoneByEntity } from '../../spec.helpers'
import { v4 as uuid } from 'uuid'
import { HttpStatus } from '@nestjs/common'
import { IdeasService } from '../../ideas.service'
import { IdeaMilestonesService } from '../idea.milestones.service'
import { CreateIdeaMilestoneDto } from '../dto/createIdeaMilestoneDto'
import { IdeaStatus } from '../../ideaStatus'
import { IdeaMilestoneStatus } from '../ideaMilestoneStatus'
import { IdeaMilestoneNetworkDto } from '../dto/ideaMilestoneNetworkDto'
import { Idea } from '../../entities/idea.entity'
import { IdeaMilestone } from '../entities/idea.milestone.entity'
import { IdeaMilestoneNetwork } from '../entities/idea.milestone.network.entity'
import { CreateIdeaMilestoneProposalDto } from './dto/CreateIdeaMilestoneProposalDto'

const createIdeaMilestoneDto = (networkValue: number = 100) => new CreateIdeaMilestoneDto(
    'ideaMilestoneSubject',
    [{ name: 'polkadot', value: networkValue }],
    null,
    null,
    'ideaMilestoneDescription',
)

const baseUrl = (ideaId: string, ideaMilestoneId: string) => `/api/v1/ideas/${ideaId}/milestones/${ideaMilestoneId}/proposals`

describe('/api/v1/ideas/:ideaId/milestones/:ideaMilestoneId/proposals', () => {

    const app = beforeSetupFullApp()

    const ideasService = beforeAllSetup(() => app().get<IdeasService>(IdeasService))
    const ideaMilestonesService = beforeAllSetup(() => app.get().get<IdeaMilestonesService>(IdeaMilestonesService))

    let verifiedUserSessionHandler: SessionHandler

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        verifiedUserSessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
    })

    describe('POST', () => {

        let idea: Idea
        let createIdeaMilestoneProposalDto: CreateIdeaMilestoneProposalDto

        beforeEach(async () => {
            idea = await createIdea(
                {
                    beneficiary: uuid(),
                },
                verifiedUserSessionHandler.sessionData,
                ideasService(),
            )
            createIdeaMilestoneProposalDto = new CreateIdeaMilestoneProposalDto(
                '',
                '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
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

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            return request(app())
                .post(baseUrl(idea.id, ideaMilestone.id))
                .send(createIdeaMilestoneProposalDto)
                .expect(HttpStatus.FORBIDDEN)

        })

        it(`should return ${HttpStatus.FORBIDDEN} for idea created by other user`, async () => {

            const otherVerifiedUserSessionHandler = await createUserSessionHandlerWithVerifiedEmail(app(), 'other@example.com', 'other')

            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                verifiedUserSessionHandler.sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            return otherVerifiedUserSessionHandler.authorizeRequest(
                request(app())
                    .post(baseUrl(idea.id, ideaMilestone.id))
                    .send(createIdeaMilestoneProposalDto),
            ).expect(HttpStatus.FORBIDDEN)

        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {

            const notVerifiedUserSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')

            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                verifiedUserSessionHandler.sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            return notVerifiedUserSessionHandler.authorizeRequest(
                request(app())
                    .post(baseUrl(idea.id, ideaMilestone.id))
                    .send(createIdeaMilestoneProposalDto),
            ).expect(HttpStatus.FORBIDDEN)

        })

        it(`it should return ${HttpStatus.NOT_FOUND} for not existing idea`, async () => {

            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                verifiedUserSessionHandler.sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            return verifiedUserSessionHandler.authorizeRequest(
                request(app())
                    .post(baseUrl(uuid(), ideaMilestone.id))
                    .send(createIdeaMilestoneProposalDto),
            ).expect(HttpStatus.NOT_FOUND)

        })

        it(`it should return ${HttpStatus.BAD_REQUEST} for idea with empty beneficiary address`, async () => {

            const ideaWithEmptyBeneficiaryAddress = await createIdea(
                {
                    beneficiary: '',
                },
                verifiedUserSessionHandler.sessionData,
                ideasService(),
            )

            const ideaMilestone = await createIdeaMilestone(
                ideaWithEmptyBeneficiaryAddress.id,
                createIdeaMilestoneDto(),
                verifiedUserSessionHandler.sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            return verifiedUserSessionHandler.authorizeRequest(
                request(app())
                    .post(baseUrl(ideaWithEmptyBeneficiaryAddress.id, ideaMilestone.id))
                    .send(createIdeaMilestoneProposalDto),
            ).expect(HttpStatus.BAD_REQUEST)

        })

        it(`should return ${HttpStatus.BAD_REQUEST} for idea with ${IdeaStatus.TurnedIntoProposal} status`, async () => {

            const ideaWithTurnedIntoProposalStatus = await createIdea(
                {
                    beneficiary: uuid(),
                    status: IdeaStatus.TurnedIntoProposal,
                },
                verifiedUserSessionHandler.sessionData,
                ideasService(),
            )

            const ideaMilestone = await createIdeaMilestone(
                ideaWithTurnedIntoProposalStatus.id,
                createIdeaMilestoneDto(),
                verifiedUserSessionHandler.sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            return verifiedUserSessionHandler.authorizeRequest(
                request(app())
                    .post(baseUrl(ideaWithTurnedIntoProposalStatus.id, ideaMilestone.id))
                    .send(createIdeaMilestoneProposalDto),
            ).expect(HttpStatus.BAD_REQUEST)

        })

        it(`should return ${HttpStatus.NOT_FOUND} for not existing idea milestone`, async () => {

            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                verifiedUserSessionHandler.sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            return verifiedUserSessionHandler.authorizeRequest(
                request(app())
                    .post(baseUrl(idea.id, uuid()))
                    .send(createIdeaMilestoneProposalDto),
            ).expect(HttpStatus.NOT_FOUND)

        })

        it(`should return ${HttpStatus.BAD_REQUEST} for idea milestone with ${IdeaMilestoneStatus.TurnedIntoProposal} status`, async () => {

            const ideaMilestone = await createIdeaMilestoneByEntity(
                new IdeaMilestone(
                    idea,
                    'subject',
                    IdeaMilestoneStatus.TurnedIntoProposal,
                    [
                        new IdeaMilestoneNetwork('polkadot', 100),
                    ],
                    null,
                    null,
                    null,
                ),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            return verifiedUserSessionHandler.authorizeRequest(
                request(app())
                    .post(baseUrl(idea.id, ideaMilestone.id))
                    .send(createIdeaMilestoneProposalDto),
            ).expect(HttpStatus.BAD_REQUEST)

        })

        it(`should return ${HttpStatus.NOT_FOUND} for not existing idea milestone network`, async () => {

            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                verifiedUserSessionHandler.sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = uuid()

            return verifiedUserSessionHandler.authorizeRequest(
                request(app())
                    .post(baseUrl(idea.id, ideaMilestone.id))
                    .send(createIdeaMilestoneProposalDto),
            ).expect(HttpStatus.NOT_FOUND)

        })

        it(`it should return ${HttpStatus.BAD_REQUEST} for idea milestone network which value is equal 0`, async () => {

            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(0),
                verifiedUserSessionHandler.sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            return verifiedUserSessionHandler.authorizeRequest(
                request(app())
                    .post(baseUrl(idea.id, ideaMilestone.id))
                    .send(createIdeaMilestoneProposalDto),
            ).expect(HttpStatus.BAD_REQUEST)

        })

        it(`should return ${HttpStatus.ACCEPTED} for all valid data`, async () => {

            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                verifiedUserSessionHandler.sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            return verifiedUserSessionHandler.authorizeRequest(
                request(app())
                    .post(baseUrl(idea.id, ideaMilestone.id))
                    .send(createIdeaMilestoneProposalDto),
            ).expect(HttpStatus.ACCEPTED)

        })

        it('should return idea milestone network with created extrinsic', async () => {

            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                verifiedUserSessionHandler.sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            const result = await verifiedUserSessionHandler.authorizeRequest(
                request(app())
                    .post(baseUrl(idea.id, ideaMilestone.id))
                    .send(createIdeaMilestoneProposalDto),
            )

            const body = result.body as IdeaMilestoneNetworkDto

            expect(body.name).toBe('polkadot')
            expect(body.value).toBe(100)
            expect(body.extrinsic).toBeDefined()
            expect(body.extrinsic!.extrinsicHash).toBe('0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41')
            expect(body.extrinsic!.lastBlockHash).toBe('0x74a566a72b3fdb19b766e2a8cfbee63388e56fb58edd48bce71e6177325ef13f')

        })

    })

})
