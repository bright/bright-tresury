import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SessionData } from '../../auth/session/session.decorator'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { UpdateExtrinsicDto } from '../../extrinsics/dto/updateExtrinsic.dto'
import { ExtrinsicEvent } from '../../extrinsics/extrinsicEvent'
import { ProposalsService } from '../../proposals/proposals.service'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../utils/spec.helpers'
import { IdeaNetworkStatus } from '../entities/idea-network-status'
import { EmptyBeneficiaryException } from '../exceptions/empty-beneficiary.exception'
import { IdeaNetwork } from '../entities/idea-network.entity'
import { IdeasService } from '../ideas.service'
import { IdeaStatus } from '../entities/idea-status'
import { createIdea, createSessionData } from '../spec.helpers'
import { CreateIdeaProposalDto, IdeaProposalDataDto } from './dto/create-idea-proposal.dto'
import { IdeaProposalsService } from './idea-proposals.service'
import { v4 as uuid } from 'uuid'
import { Idea } from '../entities/idea.entity'
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

describe('IdeaProposalsService', () => {
    const app = beforeSetupFullApp()

    const ideasService = beforeAllSetup(() => app().get<IdeasService>(IdeasService))
    const ideaProposalsService = beforeAllSetup(() => app().get<IdeaProposalsService>(IdeaProposalsService))
    const blockchainService = beforeAllSetup(() => app().get<BlockchainService>(BlockchainService))
    const proposalsService = beforeAllSetup(() => app().get<ProposalsService>(ProposalsService))

    const ideaNetworkRepository = beforeAllSetup(() =>
        app().get<Repository<IdeaNetwork>>(getRepositoryToken(IdeaNetwork)),
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
                networks: [{ name: NETWORKS.POLKADOT, value: '100' as NetworkPlanckValue }],
            },
            sessionData,
            ideasService(),
        )
    })

    describe('createProposal', () => {
        let createIdeaProposalDto: CreateIdeaProposalDto

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

            createIdeaProposalDto = new CreateIdeaProposalDto(
                '',
                '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
                '0x74a566a72b3fdb19b766e2a8cfbee63388e56fb58edd48bce71e6177325ef13f',
                new IdeaProposalDataDto(3),
            )
        })

        afterEach(() => {
            jest.clearAllMocks()
        })

        it('should throw not found exception for not existing idea', async () => {
            createIdeaProposalDto.ideaNetworkId = idea.networks[0].id

            await expect(
                ideaProposalsService().createProposal(uuid(), createIdeaProposalDto, sessionData),
            ).rejects.toThrow(NotFoundException)
        })

        it('should throw forbidden exception for idea created by other user', async () => {
            createIdeaProposalDto.ideaNetworkId = idea.networks[0].id

            await expect(
                ideaProposalsService().createProposal(idea.id, createIdeaProposalDto, otherSessionData),
            ).rejects.toThrow(ForbiddenException)
        })

        it('should throw empty beneficiary exception for idea with empty beneficiary address', async () => {
            const ideaWithEmptyBeneficiaryAddress = await createIdea(
                {
                    beneficiary: '',
                    networks: [{ name: NETWORKS.POLKADOT, value: '100' as NetworkPlanckValue }],
                },
                sessionData,
                ideasService(),
            )

            createIdeaProposalDto.ideaNetworkId = ideaWithEmptyBeneficiaryAddress.networks[0].id

            await expect(
                ideaProposalsService().createProposal(
                    ideaWithEmptyBeneficiaryAddress.id,
                    createIdeaProposalDto,
                    sessionData,
                ),
            ).rejects.toThrow(EmptyBeneficiaryException)
        })

        it(`should return bad request exception for idea and network with ${IdeaStatus.TurnedIntoProposal} status`, async () => {
            const ideaAlreadyTurned = await createIdea(
                {
                    beneficiary: uuid(),
                    status: IdeaStatus.TurnedIntoProposal,
                    networks: [{ name: 'polkadot', value: '100' as NetworkPlanckValue }],
                },
                sessionData,
                ideasService(),
            )
            await ideaNetworkRepository().save({
                id: ideaAlreadyTurned.networks[0].id,
                status: IdeaNetworkStatus.TurnedIntoProposal,
            })
            createIdeaProposalDto.ideaNetworkId = ideaAlreadyTurned.networks[0].id

            await expect(
                ideaProposalsService().createProposal(ideaAlreadyTurned.id, createIdeaProposalDto, sessionData),
            ).rejects.toThrow(BadRequestException)
        })

        it(`should return bad request exception for idea with ${IdeaStatus.Draft} status`, async () => {
            const draftIdea = await createIdea(
                {
                    beneficiary: uuid(),
                    status: IdeaStatus.Draft,
                    networks: [{ name: 'polkadot', value: '100' as NetworkPlanckValue }],
                },
                sessionData,
                ideasService(),
            )
            await ideaNetworkRepository().save({
                id: draftIdea.networks[0].id,
                status: IdeaNetworkStatus.Active,
            })
            createIdeaProposalDto.ideaNetworkId = draftIdea.networks[0].id

            await expect(
                ideaProposalsService().createProposal(draftIdea.id, createIdeaProposalDto, sessionData),
            ).rejects.toThrow(BadRequestException)
        })

        it(`should resolve for idea already turned into proposal for a NOT turned network`, async () => {
            const ideaAlreadyTurned = await createIdea(
                {
                    beneficiary: uuid(),
                    networks: [
                        { name: NETWORKS.POLKADOT, value: '100' as NetworkPlanckValue },
                        { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue },
                    ],
                },
                sessionData,
                ideasService(),
            )
            // turn idea into proposal for first network
            await ideaProposalsService().createProposal(
                ideaAlreadyTurned.id,
                { ...createIdeaProposalDto, ideaNetworkId: ideaAlreadyTurned.networks[0].id },
                sessionData,
            )

            // try turning idea into proposal for the second network
            await expect(
                ideaProposalsService().createProposal(
                    ideaAlreadyTurned.id,
                    { ...createIdeaProposalDto, ideaNetworkId: ideaAlreadyTurned.networks[0].id },
                    sessionData,
                ),
            ).resolves.toBeDefined()
        })

        it(`should return bad request exception for idea with ${IdeaStatus.MilestoneSubmission} status`, async () => {
            const ideaWithMilestoneSubmissionStatus = await createIdea(
                {
                    beneficiary: uuid(),
                    status: IdeaStatus.MilestoneSubmission,
                    networks: [{ name: NETWORKS.POLKADOT, value: '100' as NetworkPlanckValue }],
                },
                sessionData,
                ideasService(),
            )

            createIdeaProposalDto.ideaNetworkId = ideaWithMilestoneSubmissionStatus.networks[0].id

            await expect(
                ideaProposalsService().createProposal(
                    ideaWithMilestoneSubmissionStatus.id,
                    createIdeaProposalDto,
                    sessionData,
                ),
            ).rejects.toThrow(BadRequestException)
        })

        it('should throw not found exception for not existing idea network', async () => {
            createIdeaProposalDto.ideaNetworkId = uuid()

            await expect(
                ideaProposalsService().createProposal(idea.id, createIdeaProposalDto, sessionData),
            ).rejects.toThrow(NotFoundException)
        })

        it('should throw bad request exception for idea network which value in equal 0', async () => {
            const ideaWithZeroNetworkValue = await createIdea(
                {
                    beneficiary: uuid(),
                    networks: [{ name: NETWORKS.POLKADOT, value: '0' as NetworkPlanckValue }],
                },
                sessionData,
                ideasService(),
            )

            createIdeaProposalDto.ideaNetworkId = ideaWithZeroNetworkValue.networks[0].id

            await expect(
                ideaProposalsService().createProposal(ideaWithZeroNetworkValue.id, createIdeaProposalDto, sessionData),
            ).rejects.toThrow(BadRequestException)
        })

        it('should assign extrinsic to idea network', async () => {
            createIdeaProposalDto.ideaNetworkId = idea.networks[0].id

            await ideaProposalsService().createProposal(idea.id, createIdeaProposalDto, sessionData)

            const ideaNetwork = await ideaNetworkRepository().findOne(createIdeaProposalDto.ideaNetworkId, {
                relations: ['extrinsic'],
            })

            expect(ideaNetwork!.extrinsic).toBeDefined()
        })

        it('should call extractProposalIndex method from BlockchainService', async () => {
            const extractProposalIndexSpy = jest.spyOn(blockchainService(), 'extractProposalIndex')

            createIdeaProposalDto.ideaNetworkId = idea.networks[0].id

            await ideaProposalsService().createProposal(idea.id, createIdeaProposalDto, sessionData)

            expect(extractProposalIndexSpy).toHaveBeenCalled()
        })

        it('should call turnIdeaIntoProposal if blockchainProposalIndex was found', async () => {
            jest.spyOn(blockchainService(), 'extractProposalIndex').mockImplementationOnce(
                (extrinsicEvents: ExtrinsicEvent[]): number | undefined => {
                    return 3
                },
            )

            const turnIdeaIntoProposalSpy = jest.spyOn(ideaProposalsService(), 'turnIdeaIntoProposal')

            createIdeaProposalDto.ideaNetworkId = idea.networks[0].id

            await ideaProposalsService().createProposal(idea.id, createIdeaProposalDto, sessionData)

            expect(turnIdeaIntoProposalSpy).toHaveBeenCalled()
        })

        it('should call create proposal entity if blockchainProposalIndex was found', async () => {
            jest.spyOn(blockchainService(), 'extractProposalIndex').mockImplementationOnce(
                (extrinsicEvents: ExtrinsicEvent[]): number | undefined => {
                    return 3
                },
            )

            const proposalCreateSpy = jest.spyOn(proposalsService(), 'createFromIdea')

            createIdeaProposalDto.ideaNetworkId = idea.networks[0].id

            await ideaProposalsService().createProposal(idea.id, createIdeaProposalDto, sessionData)

            expect(proposalCreateSpy).toHaveBeenCalled()
            // expect(proposalCreateSpy).toHaveBeenCalledWith({idea.milestones})
        })

        it('should not call turnIdeaIntoProposal if blockchainProposalIndex was not found', async () => {
            jest.spyOn(blockchainService(), 'extractProposalIndex').mockImplementationOnce(
                (extrinsicEvents: ExtrinsicEvent[]): number | undefined => {
                    return undefined
                },
            )

            const turnIdeaIntoProposalSpy = jest.spyOn(ideaProposalsService(), 'turnIdeaIntoProposal')

            createIdeaProposalDto.ideaNetworkId = idea.networks[0].id

            await ideaProposalsService().createProposal(idea.id, createIdeaProposalDto, sessionData)

            expect(turnIdeaIntoProposalSpy).not.toHaveBeenCalled()
        })

        it('should not call create proposal entity if blockchainProposalIndex was not found', async () => {
            jest.spyOn(blockchainService(), 'extractProposalIndex').mockImplementationOnce(
                (extrinsicEvents: ExtrinsicEvent[]): number | undefined => {
                    return undefined
                },
            )

            const proposalCreateSpy = jest.spyOn(proposalsService(), 'createFromIdea')

            createIdeaProposalDto.ideaNetworkId = idea.networks[0].id

            await ideaProposalsService().createProposal(idea.id, createIdeaProposalDto, sessionData)

            expect(proposalCreateSpy).not.toHaveBeenCalled()
        })

        it('should return idea network with extrinsic assigned', async () => {
            createIdeaProposalDto.ideaNetworkId = idea.networks[0].id

            const result = await ideaProposalsService().createProposal(idea.id, createIdeaProposalDto, sessionData)

            expect(result.extrinsic).toBeDefined()
            expect(result.extrinsic!.extrinsicHash).toBe(
                '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
            )
            expect(result.extrinsic!.lastBlockHash).toBe(
                '0x74a566a72b3fdb19b766e2a8cfbee63388e56fb58edd48bce71e6177325ef13f',
            )
        })
    })

    describe('turnIdeaIntoProposal', () => {
        it(`should change idea status to ${IdeaStatus.TurnedIntoProposal}`, async () => {
            await ideaProposalsService().turnIdeaIntoProposal(idea, idea.networks[0], 3)

            const updatedIdea = await ideasService().findOne(idea.id, sessionData)

            expect(updatedIdea.status).toBe(IdeaStatus.TurnedIntoProposal)
        })

        it('should assign blockchainProposalIndex to idea network', async () => {
            await ideaProposalsService().turnIdeaIntoProposal(idea, idea.networks[0], 3)

            const updatedIdeaNetwork = await ideaNetworkRepository().findOne(idea.networks[0].id)

            expect(updatedIdeaNetwork!.blockchainProposalId).toBe(3)
        })

        it(`should change idea network status to ${IdeaNetworkStatus.TurnedIntoProposal}`, async () => {
            await ideaProposalsService().turnIdeaIntoProposal(idea, idea.networks[0], 3)

            const ideaNetwork = await ideaNetworkRepository().findOne(idea.networks[0].id)

            expect(ideaNetwork!.status).toBe(IdeaNetworkStatus.TurnedIntoProposal)
        })

        it(`should set other idea network statuses to ${IdeaNetworkStatus.Pending}`, async () => {
            const ideaWithMultipleNetworks = await createIdea(
                {
                    beneficiary: uuid(),
                    networks: [
                        { name: NETWORKS.POLKADOT, value: '2' as NetworkPlanckValue },
                        { name: NETWORKS.KUSAMA, value: '3' as NetworkPlanckValue },
                    ],
                },
                sessionData,
                ideasService(),
            )

            await ideaProposalsService().turnIdeaIntoProposal(
                ideaWithMultipleNetworks,
                ideaWithMultipleNetworks.networks[0],
                3,
            )
            const secondNetwork = await ideaNetworkRepository().findOne(ideaWithMultipleNetworks.networks[1].id)
            expect(secondNetwork!.status).toBe(IdeaNetworkStatus.Pending)
        })

        it(`should not update other idea network status if already turned into proposal`, async () => {
            const ideaWithMultipleNetworks = await createIdea(
                {
                    beneficiary: uuid(),
                    networks: [
                        { name: NETWORKS.POLKADOT, value: '2' as NetworkPlanckValue },
                        { name: NETWORKS.KUSAMA, value: '3' as NetworkPlanckValue },
                    ],
                },
                sessionData,
                ideasService(),
            )
            // turn first network
            await ideaProposalsService().turnIdeaIntoProposal(
                ideaWithMultipleNetworks,
                ideaWithMultipleNetworks.networks[0],
                3,
            )

            // turn the second network and check
            await ideaProposalsService().turnIdeaIntoProposal(
                ideaWithMultipleNetworks,
                ideaWithMultipleNetworks.networks[1],
                3,
            )
            const secondNetwork = await ideaNetworkRepository().findOne(ideaWithMultipleNetworks.networks[1].id)
            expect(secondNetwork!.status).toBe(IdeaNetworkStatus.TurnedIntoProposal)
        })
    })
})
