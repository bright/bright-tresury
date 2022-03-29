import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { SessionData } from '../../../auth/session/session.decorator'
import { cleanAuthorizationDatabase } from '../../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { BlockchainService } from '../../../blockchain/blockchain.service'
import { UpdateExtrinsicDto } from '../../../extrinsics/dto/updateExtrinsic.dto'
import { ExtrinsicEvent } from '../../../extrinsics/extrinsicEvent'
import { ProposalsService } from '../../../proposals/proposals.service'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../../utils/spec.helpers'
import { IdeaEntity } from '../../entities/idea.entity'
import { IdeaStatus } from '../../entities/idea-status'
import { IdeasService } from '../../ideas.service'
import { createIdea, createIdeaMilestone, createSessionData, saveIdeaMilestone } from '../../spec.helpers'
import { IdeaMilestoneNetworkEntity } from '../entities/idea-milestone-network.entity'
import { IdeaMilestoneEntity } from '../entities/idea-milestone.entity'
import { IdeaMilestoneStatus } from '../entities/idea-milestone-status'
import { IdeaMilestonesService } from '../idea-milestones.service'
import { CreateIdeaMilestoneProposalDto } from './dto/create-idea-milestone-proposal.dto'
import { IdeaMilestoneProposalsService } from './idea-milestone-proposals.service'
import { IdeaMilestoneNetworkStatus } from '../entities/idea-milestone-network-status'
import { NetworkPlanckValue } from '../../../utils/types'

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

describe('IdeaMilestoneProposalsService', () => {
    const app = beforeSetupFullApp()

    const ideasService = beforeAllSetup(() => app().get<IdeasService>(IdeasService))
    const ideasRepository = beforeAllSetup(() => app().get<Repository<IdeaEntity>>(getRepositoryToken(IdeaEntity)))
    const ideaMilestonesService = beforeAllSetup(() => app().get<IdeaMilestonesService>(IdeaMilestonesService))
    const ideaMilestoneProposalsService = beforeAllSetup(() =>
        app().get<IdeaMilestoneProposalsService>(IdeaMilestoneProposalsService),
    )
    const proposalsService = beforeAllSetup(() => app().get<ProposalsService>(ProposalsService))
    const blockchainService = beforeAllSetup(() => app().get<BlockchainService>(BlockchainService))

    const ideaMilestoneNetworkRepository = beforeAllSetup(() =>
        app().get<Repository<IdeaMilestoneNetworkEntity>>(getRepositoryToken(IdeaMilestoneNetworkEntity)),
    )

    let idea: IdeaEntity
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
                async (
                    networkId: string,
                    extrinsicHash: string,
                    cb: (updateExtrinsicDto: UpdateExtrinsicDto) => Promise<void>,
                ) => {
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

        it(`should throw BadRequestException for idea with ${IdeaStatus.TurnedIntoProposal} status`, async () => {
            const ideaWithTurnedIntoProposalStatus = await createIdea(
                {
                    beneficiary: uuid(),
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
            await ideasRepository().save({
                ...ideaWithTurnedIntoProposalStatus,
                status: IdeaStatus.TurnedIntoProposal,
            })

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            await expect(
                ideaMilestoneProposalsService().createProposal(
                    ideaWithTurnedIntoProposalStatus.id,
                    ideaMilestone.id,
                    { ...createIdeaMilestoneProposalDto, ideaMilestoneNetworkId: ideaMilestone.networks[0].id },
                    sessionData,
                ),
            ).rejects.toThrow(BadRequestException)
        })

        it(`should throw BadRequestException for idea with ${IdeaStatus.Draft} status`, async () => {
            const ideaWithDraftStatus = await createIdea(
                {
                    beneficiary: uuid(),
                },
                sessionData,
                ideasService(),
            )

            const ideaMilestone = await createIdeaMilestone(
                ideaWithDraftStatus.id,
                createIdeaMilestoneDto(),
                sessionData,
                ideaMilestonesService(),
            )
            await ideasRepository().save({
                ...ideaWithDraftStatus,
                status: IdeaStatus.Draft,
            })

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            await expect(
                ideaMilestoneProposalsService().createProposal(
                    ideaWithDraftStatus.id,
                    ideaMilestone.id,
                    { ...createIdeaMilestoneProposalDto, ideaMilestoneNetworkId: ideaMilestone.networks[0].id },
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
                createIdeaMilestoneDto('100' as NetworkPlanckValue, ''),
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

        it(`should throw BadRequestException for idea milestone with ${IdeaMilestoneStatus.TurnedIntoProposal} status`, async () => {
            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                {
                    beneficiary: uuid(),
                    networks: [
                        {
                            name: NETWORKS.POLKADOT,
                            value: '100' as NetworkPlanckValue,
                            status: IdeaMilestoneNetworkStatus.Active,
                        },
                    ],
                    details: {
                        subject: 'milestone subject',
                    },
                },
                sessionData,
                ideaMilestonesService(),
            )
            ideaMilestone.status = IdeaMilestoneStatus.TurnedIntoProposal
            await saveIdeaMilestone(ideaMilestone)
            // update ideaMilestoneNetwork status to TurnedIntoProposal
            const [ideaMilestoneNetwork] = await ideaMilestoneNetworkRepository().find({ ideaMilestone })
            ideaMilestoneNetwork.status = IdeaMilestoneNetworkStatus.TurnedIntoProposal
            await ideaMilestoneNetworkRepository().save(ideaMilestoneNetwork)

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            // this should fail because the milestone network status is already turned_into_proposal
            await expect(
                ideaMilestoneProposalsService().createProposal(
                    idea.id,
                    ideaMilestone.id,
                    createIdeaMilestoneProposalDto,
                    sessionData,
                ),
            ).rejects.toThrow(BadRequestException)
        })

        it(`should resolve for idea ${IdeaStatus.MilestoneSubmission} and milestone ${IdeaMilestoneStatus.Active}`, async () => {
            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                sessionData,
                ideaMilestonesService(),
            )
            await app()
                .get<Repository<IdeaEntity>>(getRepositoryToken(IdeaEntity))
                .save({ ...idea, status: IdeaStatus.MilestoneSubmission })
            ideaMilestone.status = IdeaMilestoneStatus.Active
            await saveIdeaMilestone(ideaMilestone)

            createIdeaMilestoneProposalDto.ideaMilestoneNetworkId = ideaMilestone.networks[0].id

            await expect(
                ideaMilestoneProposalsService().createProposal(
                    idea.id,
                    ideaMilestone.id,
                    createIdeaMilestoneProposalDto,
                    sessionData,
                ),
            ).resolves.toBeDefined()
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
                createIdeaMilestoneDto('0' as NetworkPlanckValue),
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

        it('should call extractProposalIndex method from BlockchainService', async () => {
            const extractProposalIndexSpy = jest.spyOn(blockchainService(), 'extractProposalIndex')

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

            expect(extractProposalIndexSpy).toHaveBeenCalled()
        })

        it('should call turnIdeaMilestoneIntoProposal if blockchainProposalIndex was found', async () => {
            jest.spyOn(blockchainService(), 'extractProposalIndex').mockImplementationOnce(
                (extrinsicEvents: ExtrinsicEvent[]): number | undefined => {
                    return 3
                },
            )

            const turnIdeaMilestoneIntoProposalSpy = jest.spyOn<IdeaMilestoneProposalsService, any>(
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

        it('should call call create proposal entity if blockchainProposalIndex was found', async () => {
            jest.spyOn(blockchainService(), 'extractProposalIndex').mockImplementationOnce(
                (extrinsicEvents: ExtrinsicEvent[]): number | undefined => {
                    return 3
                },
            )

            const proposalCreateSpy = jest.spyOn(proposalsService(), 'createFromMilestone')

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

            expect(proposalCreateSpy).toHaveBeenCalled()
        })

        it('should not call turnIdeaMilestoneIntoProposal if blockchainProposalIndex was not found', async () => {
            jest.spyOn(blockchainService(), 'extractProposalIndex').mockImplementationOnce(
                (extrinsicEvents: ExtrinsicEvent[]): number | undefined => {
                    return undefined
                },
            )

            const turnIdeaMilestoneIntoProposalSpy = jest.spyOn<IdeaMilestoneProposalsService, any>(
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

        it('should not call create proposal entity if blockchainProposalIndex was not found', async () => {
            jest.spyOn(blockchainService(), 'extractProposalIndex').mockImplementationOnce(
                (extrinsicEvents: ExtrinsicEvent[]): number | undefined => {
                    return undefined
                },
            )

            const proposalCreateSpy = jest.spyOn(proposalsService(), 'createFromMilestone')

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

            expect(proposalCreateSpy).not.toHaveBeenCalled()
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
        let ideaMilestone: IdeaMilestoneEntity
        let ideaMilestoneNetwork: IdeaMilestoneNetworkEntity

        beforeEach(async () => {
            ideaMilestone = await createIdeaMilestone(
                idea.id,
                createIdeaMilestoneDto(),
                sessionData,
                ideaMilestonesService(),
            )
            ideaMilestoneNetwork = ideaMilestone.networks[0]
        })

        it(`should change idea status to ${IdeaStatus.MilestoneSubmission}`, async () => {
            await ideaMilestoneProposalsService().turnIdeaMilestoneIntoProposal(
                idea,
                ideaMilestone,
                ideaMilestoneNetwork,
                3,
            )

            const { entity: updatedIdea } = await ideasService().findOne(idea.id, sessionData)

            expect(updatedIdea.status).toBe(IdeaStatus.MilestoneSubmission)
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
        it('should turn one ideaMilestoneNetwork into proposal and set Pending status to other', async () => {
            const ideaWithTwoNetworks = await createIdea(
                {
                    beneficiary: uuid(),
                    networks: [
                        { name: NETWORKS.POLKADOT, value: '1000' as NetworkPlanckValue },
                        { name: NETWORKS.KUSAMA, value: '1000' as NetworkPlanckValue },
                    ],
                },
                sessionData,
                ideasService(),
            )
            const ideaMilestoneWithTwoNetworks = await createIdeaMilestone(
                ideaWithTwoNetworks.id,
                {
                    networks: [
                        {
                            name: NETWORKS.POLKADOT,
                            value: '1000' as NetworkPlanckValue,
                            status: IdeaMilestoneNetworkStatus.Active,
                        },
                        {
                            name: NETWORKS.KUSAMA,
                            value: '1000' as NetworkPlanckValue,
                            status: IdeaMilestoneNetworkStatus.Active,
                        },
                    ],
                },
                sessionData,
                ideaMilestonesService(),
            )
            const ideaMilestoneNetworkA = ideaMilestoneWithTwoNetworks.networks[0]
            const ideaMilestoneNetworkB = ideaMilestoneWithTwoNetworks.networks[1]
            await ideaMilestoneProposalsService().turnIdeaMilestoneIntoProposal(
                ideaWithTwoNetworks,
                ideaMilestoneWithTwoNetworks,
                ideaMilestoneNetworkA,
                0,
            )
            const { entity: modifiedIdea } = await ideasService().findOne(ideaWithTwoNetworks.id, sessionData)
            expect(modifiedIdea.status).toBe(IdeaStatus.MilestoneSubmission)

            const modifiedIdeaMilestone = await ideaMilestonesService().findOne(
                ideaMilestoneWithTwoNetworks.id,
                sessionData,
            )
            expect(modifiedIdeaMilestone.status).toBe(IdeaMilestoneStatus.TurnedIntoProposal)

            const modifiedIdeaMilestoneNetworkA = modifiedIdeaMilestone.networks.find(
                ({ id }) => id === ideaMilestoneNetworkA.id,
            )!
            expect(modifiedIdeaMilestoneNetworkA.status).toBe(IdeaMilestoneNetworkStatus.TurnedIntoProposal)

            const modifiedIdeaMilestoneNetworkB = modifiedIdeaMilestone.networks.find(
                ({ id }) => id === ideaMilestoneNetworkB.id,
            )!
            expect(modifiedIdeaMilestoneNetworkB.status).toBe(IdeaMilestoneNetworkStatus.Pending)
        })

        it('turn both ideaMilestoneNetworks into proposals and check that their statuses are TurnedIntoProposal', async () => {
            const ideaWithTwoNetworks = await createIdea(
                {
                    beneficiary: uuid(),
                    networks: [
                        { name: NETWORKS.POLKADOT, value: '1000' as NetworkPlanckValue },
                        { name: NETWORKS.KUSAMA, value: '1000' as NetworkPlanckValue },
                    ],
                },
                sessionData,
                ideasService(),
            )
            const ideaMilestoneWithTwoNetworks = await createIdeaMilestone(
                ideaWithTwoNetworks.id,
                {
                    networks: [
                        {
                            name: NETWORKS.POLKADOT,
                            value: '1000' as NetworkPlanckValue,
                            status: IdeaMilestoneNetworkStatus.Active,
                        },
                        {
                            name: NETWORKS.KUSAMA,
                            value: '1000' as NetworkPlanckValue,
                            status: IdeaMilestoneNetworkStatus.Active,
                        },
                    ],
                },
                sessionData,
                ideaMilestonesService(),
            )
            const ideaMilestoneNetworkA = ideaMilestoneWithTwoNetworks.networks[0]

            await ideaMilestoneProposalsService().turnIdeaMilestoneIntoProposal(
                ideaWithTwoNetworks,
                ideaMilestoneWithTwoNetworks,
                ideaMilestoneNetworkA,
                0,
            )

            const { entity: ideaAfterFirstTurn } = await ideasService().findOne(ideaWithTwoNetworks.id, sessionData)
            const ideaMilestoneAfterFirstTurn = await ideaMilestonesService().findOne(
                ideaMilestoneWithTwoNetworks.id,
                sessionData,
            )
            const ideaMilestoneNetworkB = ideaMilestoneWithTwoNetworks.networks[1]
            await ideaMilestoneProposalsService().turnIdeaMilestoneIntoProposal(
                ideaAfterFirstTurn,
                ideaMilestoneAfterFirstTurn,
                ideaMilestoneNetworkB,
                0,
            )

            const { entity: modifiedIdea } = await ideasService().findOne(ideaWithTwoNetworks.id, sessionData)
            expect(modifiedIdea.status).toBe(IdeaStatus.MilestoneSubmission)

            const modifiedIdeaMilestone = await ideaMilestonesService().findOne(
                ideaMilestoneWithTwoNetworks.id,
                sessionData,
            )
            expect(modifiedIdeaMilestone.status).toBe(IdeaMilestoneStatus.TurnedIntoProposal)

            const modifiedIdeaMilestoneNetworkA = modifiedIdeaMilestone.networks.find(
                ({ id }) => id === ideaMilestoneNetworkA.id,
            )!
            expect(modifiedIdeaMilestoneNetworkA.status).toBe(IdeaMilestoneNetworkStatus.TurnedIntoProposal)

            const modifiedIdeaMilestoneNetworkB = modifiedIdeaMilestone.networks.find(
                ({ id }) => id === ideaMilestoneNetworkB.id,
            )!
            expect(modifiedIdeaMilestoneNetworkB.status).toBe(IdeaMilestoneNetworkStatus.TurnedIntoProposal)
        })
    })
})
