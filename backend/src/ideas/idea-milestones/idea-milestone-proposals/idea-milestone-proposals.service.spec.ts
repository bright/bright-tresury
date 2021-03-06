import { beforeAllSetup, beforeSetupFullApp, cleanDatabase } from '../../../utils/spec.helpers'
import { cleanAuthorizationDatabase } from '../../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createIdea, createIdeaMilestone, createIdeaMilestoneByEntity, createSessionData } from '../../spec.helpers'
import { IdeasService } from '../../ideas.service'
import { v4 as uuid } from 'uuid'
import { CreateIdeaMilestoneDto } from '../dto/create-idea-milestone.dto'
import { IdeaMilestonesService } from '../idea-milestones.service'
import { CreateIdeaMilestoneProposalDto } from './dto/create-idea-milestone-proposal.dto'
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { SessionData } from '../../../auth/session/session.decorator'
import { IdeaStatus } from '../../idea-status'
import { IdeaMilestoneStatus } from '../idea-milestone-status'
import { Idea } from '../../entities/idea.entity'
import { BlockchainService } from '../../../blockchain/blockchain.service'
import { UpdateExtrinsicDto } from '../../../extrinsics/dto/updateExtrinsic.dto'
import { Repository } from 'typeorm'
import { IdeaMilestoneNetwork } from '../entities/idea-milestone-network.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ExtrinsicEvent } from '../../../extrinsics/extrinsicEvent'
import { IdeaMilestone } from '../entities/idea-milestone.entity'
import { IdeaMilestoneProposalsService } from './idea-milestone-proposals.service'

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

const createIdeaMilestoneDto = (
    ideaMilestoneNetworkValue: number = 100,
    beneficiary: string = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
) =>
    new CreateIdeaMilestoneDto(
        'subject',
        [{ name: 'polkadot', value: ideaMilestoneNetworkValue }],
        beneficiary,
        null,
        null,
        null,
    )

describe('IdeaMilestoneProposalsService', () => {
    const app = beforeSetupFullApp()

    const ideasService = beforeAllSetup(() => app().get<IdeasService>(IdeasService))
    const ideaMilestonesService = beforeAllSetup(() => app().get<IdeaMilestonesService>(IdeaMilestonesService))
    const ideaMilestoneProposalsService = beforeAllSetup(() =>
        app().get<IdeaMilestoneProposalsService>(IdeaMilestoneProposalsService),
    )
    const blockchainService = beforeAllSetup(() => app().get<BlockchainService>(BlockchainService))

    const ideaMilestoneNetworkRepository = beforeAllSetup(() =>
        app().get<Repository<IdeaMilestoneNetwork>>(getRepositoryToken(IdeaMilestoneNetwork)),
    )

    let idea: Idea
    let sessionData: SessionData
    let otherSessionData: SessionData

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()

        sessionData = await createSessionData()
        otherSessionData = await createSessionData({ username: 'other', email: 'other@example.com' })

        idea = await createIdea(
            {
                beneficiary: uuid(),
            },
            sessionData,
            ideasService(),
        )
    })

    describe('createProposal', () => {
        let createIdeaMilestoneProposalDto: CreateIdeaMilestoneProposalDto

        beforeEach(async () => {
            jest.spyOn(blockchainService(), 'listenForExtrinsic').mockImplementationOnce(
                async (extrinsicHash: string, cb: (updateExtrinsicDto: UpdateExtrinsicDto) => Promise<void>) => {
                    await cb(updateExtrinsicDto)
                },
            )

            createIdeaMilestoneProposalDto = new CreateIdeaMilestoneProposalDto(
                '',
                '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
                '0x74a566a72b3fdb19b766e2a8cfbee63388e56fb58edd48bce71e6177325ef13f',
            )
        })

        afterEach(() => {
            jest.clearAllMocks()
        })

        it('should throw not found exception for not existing idea', async () => {
            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            await expect(
                ideaMilestoneProposalsService().createProposal(
                    uuid(),
                    ideaMilestone.id,
                    createIdeaMilestoneProposalDto,
                    sessionData,
                ),
            ).rejects.toThrow(NotFoundException)
        })

        it('should throw forbidden exception for idea created by other user', async () => {
            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            await expect(
                ideaMilestoneProposalsService().createProposal(
                    idea.id,
                    ideaMilestone.id,
                    createIdeaMilestoneProposalDto,
                    otherSessionData,
                ),
            ).rejects.toThrow(ForbiddenException)
        })

        it(`should return bad request exception for idea with ${IdeaStatus.TurnedIntoProposal} status`, async () => {
            const ideaWithTurnedIntoProposalStatus = await createIdea(
                {
                    beneficiary: uuid(),
                    status: IdeaStatus.TurnedIntoProposal,
                },
                sessionData,
                ideasService(),
            )

            const ideaMilestone = await createIdeaMilestone(
                ideaWithTurnedIntoProposalStatus.id,
                createIdeaMilestoneDto(),
                sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            await expect(
                ideaMilestoneProposalsService().createProposal(
                    ideaWithTurnedIntoProposalStatus.id,
                    ideaMilestone.id,
                    createIdeaMilestoneProposalDto,
                    sessionData,
                ),
            ).rejects.toThrow(BadRequestException)
        })

        it('should throw not found exception for not existing idea milestone', async () => {
            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            await expect(
                ideaMilestoneProposalsService().createProposal(
                    idea.id,
                    uuid(),
                    createIdeaMilestoneProposalDto,
                    sessionData,
                ),
            ).rejects.toThrow(NotFoundException)
        })

        it('should throw empty beneficiary exception for idea milestone with empty beneficiary address', async () => {
            const ideaMilestoneWithEmptyBeneficiaryAddress = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(100, ''),
                sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId =
                ideaMilestoneWithEmptyBeneficiaryAddress.networks[0].id

            await expect(
                ideaMilestoneProposalsService().createProposal(
                    idea.id,
                    ideaMilestoneWithEmptyBeneficiaryAddress.id,
                    createIdeaMilestoneProposalDto,
                    sessionData,
                ),
            ).rejects.toThrow(BadRequestException)
        })

        it(`should return bad request exception for idea milestone with ${IdeaMilestoneStatus.TurnedIntoProposal} status`, async () => {
            const ideaMilestone = await createIdeaMilestoneByEntity(
                new IdeaMilestone(
                    idea,
                    'subject',
                    IdeaMilestoneStatus.TurnedIntoProposal,
                    [new IdeaMilestoneNetwork('polkadot', 100)],
                    '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                    null,
                    null,
                    null,
                ),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            await expect(
                ideaMilestoneProposalsService().createProposal(
                    idea.id,
                    ideaMilestone.id,
                    createIdeaMilestoneProposalDto,
                    sessionData,
                ),
            ).rejects.toThrow(BadRequestException)
        })

        it('should throw not found exception for not existing idea milestone network', async () => {
            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = uuid()

            await expect(
                ideaMilestoneProposalsService().createProposal(
                    idea.id,
                    ideaMilestone.id,
                    createIdeaMilestoneProposalDto,
                    sessionData,
                ),
            ).rejects.toThrow(NotFoundException)
        })

        it('should throw bad request exception for idea milestone network which value in equal 0', async () => {
            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(0),
                sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            await expect(
                ideaMilestoneProposalsService().createProposal(
                    idea.id,
                    ideaMilestone.id,
                    createIdeaMilestoneProposalDto,
                    sessionData,
                ),
            ).rejects.toThrow(BadRequestException)
        })

        it('should assign extrinsic to idea milestone network', async () => {
            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            await ideaMilestoneProposalsService().createProposal(
                idea.id,
                ideaMilestone.id,
                createIdeaMilestoneProposalDto,
                sessionData,
            )

            const ideaMilestoneNetwork = await ideaMilestoneNetworkRepository().findOne(
                createIdeaMilestoneProposalDto.ideaMilestoneNetworkId,
                {
                    relations: ['extrinsic'],
                },
            )

            expect(ideaMilestoneNetwork!.extrinsic).toBeDefined()
        })

        it('should call extractBlockchainProposalIndexFromExtrinsicEvents method from BlockchainService', async () => {
            const extractBlockchainProposalIndexFromExtrinsicEventsSpy = jest.spyOn(
                blockchainService(),
                'extractBlockchainProposalIndexFromExtrinsicEvents',
            )

            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            await ideaMilestoneProposalsService().createProposal(
                idea.id,
                ideaMilestone.id,
                createIdeaMilestoneProposalDto,
                sessionData,
            )

            expect(extractBlockchainProposalIndexFromExtrinsicEventsSpy).toHaveBeenCalled()
        })

        it('should call turnIdeaMilestoneIntoProposal if blockchainProposalIndex was found', async () => {
            jest.spyOn(blockchainService(), 'extractBlockchainProposalIndexFromExtrinsicEvents').mockImplementationOnce(
                (extrinsicEvents: ExtrinsicEvent[]): number | undefined => {
                    return 3
                },
            )

            const turnIdeaMilestoneIntoProposalSpy = jest.spyOn(
                ideaMilestoneProposalsService(),
                'turnIdeaMilestoneIntoProposal',
            )

            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            await ideaMilestoneProposalsService().createProposal(
                idea.id,
                ideaMilestone.id,
                createIdeaMilestoneProposalDto,
                sessionData,
            )

            expect(turnIdeaMilestoneIntoProposalSpy).toHaveBeenCalled()
        })

        it('should not call turnIdeaMilestoneIntoProposal if blockchainProposalIndex was not found', async () => {
            jest.spyOn(blockchainService(), 'extractBlockchainProposalIndexFromExtrinsicEvents').mockImplementationOnce(
                (extrinsicEvents: ExtrinsicEvent[]): number | undefined => {
                    return undefined
                },
            )

            const turnIdeaMilestoneIntoProposalSpy = jest.spyOn(
                ideaMilestoneProposalsService(),
                'turnIdeaMilestoneIntoProposal',
            )

            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            await ideaMilestoneProposalsService().createProposal(
                idea.id,
                ideaMilestone.id,
                createIdeaMilestoneProposalDto,
                sessionData,
            )

            expect(turnIdeaMilestoneIntoProposalSpy).not.toHaveBeenCalled()
        })

        it('should return idea milestone network with extrinsic assigned', async () => {
            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                sessionData,
                ideaMilestonesService(),
            )

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            const result = await ideaMilestoneProposalsService().createProposal(
                idea.id,
                ideaMilestone.id,
                createIdeaMilestoneProposalDto,
                sessionData,
            )

            expect(result.extrinsic).toBeDefined()
            expect(result.extrinsic!.extrinsicHash).toBe(
                '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
            )
            expect(result.extrinsic!.lastBlockHash).toBe(
                '0x74a566a72b3fdb19b766e2a8cfbee63388e56fb58edd48bce71e6177325ef13f',
            )
        })
    })

    describe('turnIdeaMilestoneIntoProposal', () => {
        let ideaMilestone: IdeaMilestone
        let ideaMilestoneNetwork: IdeaMilestoneNetwork

        beforeEach(async () => {
            ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                sessionData,
                ideaMilestonesService(),
            )
            ideaMilestoneNetwork = ideaMilestone.networks[0]
        })

        it(`should change idea status to ${IdeaStatus.TurnedIntoProposalByMilestone}`, async () => {
            await ideaMilestoneProposalsService().turnIdeaMilestoneIntoProposal(
                idea,
                ideaMilestone,
                ideaMilestoneNetwork,
                3,
            )

            const updatedIdea = await ideasService().findOne(idea.id, sessionData)

            expect(updatedIdea.status).toBe(IdeaStatus.TurnedIntoProposalByMilestone)
        })

        it(`should change idea milestone status to ${IdeaMilestoneStatus.TurnedIntoProposal}`, async () => {
            await ideaMilestoneProposalsService().turnIdeaMilestoneIntoProposal(
                idea,
                ideaMilestone,
                ideaMilestoneNetwork,
                3,
            )

            const updatedIdeaMilestone = await ideaMilestonesService().findOne(ideaMilestone.id, sessionData)

            expect(updatedIdeaMilestone.status).toBe(IdeaMilestoneStatus.TurnedIntoProposal)
        })

        it(`should assign blockchainProposalIndex to idea milestone network`, async () => {
            await ideaMilestoneProposalsService().turnIdeaMilestoneIntoProposal(
                idea,
                ideaMilestone,
                ideaMilestoneNetwork,
                3,
            )

            const updatedIdeaMilestoneNetwork = await ideaMilestoneNetworkRepository().findOne(ideaMilestoneNetwork.id)

            expect(updatedIdeaMilestoneNetwork!.blockchainProposalId).toBe(3)
        })
    })
})
