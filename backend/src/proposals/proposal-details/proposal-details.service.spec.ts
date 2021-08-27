import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { BlockchainProposalStatus } from '../../blockchain/dto/blockchain-proposal.dto'
import { IdeaProposalsService } from '../../ideas/idea-proposals/idea-proposals.service'
import { createIdea, createSessionData } from '../../ideas/spec.helpers'
import { Web3Address } from '../../users/web3-addresses/web3-address.entity'
import { beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../utils/spec.helpers'
import { Proposal } from '../entities/proposal.entity'
import { IdeaWithMilestones, ProposalsService } from '../proposals.service'
import { createProposerSessionData, mockedBlockchainService, proposals, setUpProposalFromIdea } from '../spec.helpers'
import { ProposalDetailsService } from './proposal-details.service'

describe('ProposalDetailsService', () => {
    const app = beforeSetupFullApp()
    const service = () => app().get(ProposalDetailsService)

    const proposalsRepository = () => app().get<Repository<Proposal>>(getRepositoryToken(Proposal))
    const proposalsService = () => app().get<ProposalsService>(ProposalsService)
    const ideaProposalsService = () => app().get<IdeaProposalsService>(IdeaProposalsService)

    beforeAll(() => {
        jest.spyOn(app().get(BlockchainService), 'getProposals').mockImplementation(
            mockedBlockchainService.getProposals,
        )
    })

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('create', () => {
        it(`should save all data`, async () => {
            const proposal = proposals[0]
            const sessionData = await createProposerSessionData(proposal)

            await service().create(
                proposal.proposalIndex,
                NETWORKS.POLKADOT,
                {
                    title: 'new title',
                    content: 'new content',
                    contact: 'new contact',
                    portfolio: 'new portfolio',
                    field: 'new field',
                    links: ['new link'],
                },
                sessionData,
            )

            const { details } = (await proposalsRepository().findOne({ blockchainProposalId: proposal.proposalIndex }))!
            expect(details.title).toBe('new title')
            expect(details.content).toBe('new content')
            expect(details.contact).toBe('new contact')
            expect(details.portfolio).toBe('new portfolio')
            expect(details.field).toBe('new field')
            expect(details.links).toBe('["new link"]')
        })

        it(`should throw ConflictException when trying to create already existing details`, async () => {
            const {
                proposal,
                sessionHandler: { sessionData },
            } = await setUpProposalFromIdea(app())

            await expect(
                service().create(
                    proposal.blockchainProposalId,
                    proposal.networkId,
                    {
                        title: 'new title',
                    },
                    sessionData,
                ),
            ).rejects.toThrow(ConflictException)
        })

        it(`should throw ForbiddenException when user with no address assigned tries to create`, async () => {
            const proposal = proposals[0]
            const notProposerSessionData = await createSessionData()

            await expect(
                service().create(
                    proposal.proposalIndex,
                    NETWORKS.POLKADOT,
                    {
                        title: 'new title',
                    },
                    notProposerSessionData,
                ),
            ).rejects.toThrow(ForbiddenException)
        })

        it(`should throw ForbiddenException when user with not a proposer address assigned tries to create`, async () => {
            const proposal = proposals[0]
            const notProposerSessionData = await createProposerSessionData(proposals[1])

            await expect(
                service().create(
                    proposal.proposalIndex,
                    NETWORKS.POLKADOT,
                    {
                        title: 'new title',
                    },
                    notProposerSessionData,
                ),
            ).rejects.toThrow(ForbiddenException)
        })

        it(`should throw NotFoundException when trying to create details for a not existing proposal`, async () => {
            const sessionData = await createSessionData()

            await expect(service().create(150, NETWORKS.POLKADOT, { title: 'title' }, sessionData)).rejects.toThrow(
                NotFoundException,
            )
        })

        it(`should throw BadRequestException when trying to create details for a proposal with ${BlockchainProposalStatus.Approval} status`, async () => {
            const proposal = proposals[3]
            const sessionData = await createProposerSessionData(proposal)
            await expect(
                service().create(proposal.proposalIndex, NETWORKS.POLKADOT, { title: 'title' }, sessionData),
            ).rejects.toThrow(BadRequestException)
        })
    })

    describe('update', () => {
        it(`should update all data`, async () => {
            const {
                sessionHandler: { sessionData },
                proposal,
            } = await setUpProposalFromIdea(app())

            await service().update(
                proposal.blockchainProposalId,
                proposal.networkId,
                {
                    title: 'new title',
                    content: 'new content',
                    contact: 'new contact',
                    portfolio: 'new portfolio',
                    field: 'new field',
                    links: ['new link'],
                },
                sessionData,
            )

            const { details } = (await proposalsRepository().findOne(proposal.id))!
            expect(details.title).toBe('new title')
            expect(details.content).toBe('new content')
            expect(details.contact).toBe('new contact')
            expect(details.portfolio).toBe('new portfolio')
            expect(details.field).toBe('new field')
            expect(details.links).toBe('["new link"]')
        })

        it(`should update only passed data`, async () => {
            const {
                sessionHandler: { sessionData },
                proposal,
            } = await setUpProposalFromIdea(app())

            await service().update(
                proposal.blockchainProposalId,
                proposal.networkId,
                {
                    title: 'new title',
                },
                sessionData,
            )

            const { details } = (await proposalsRepository().findOne(proposal.id))!
            expect(details.title).toBe('new title')
            expect(details.content).toBe(proposal.details.content)
            expect(details.contact).toBe(proposal.details.contact)
            expect(details.portfolio).toBe(proposal.details.portfolio)
            expect(details.field).toBe(proposal.details.field)
            expect(details.links).toBe(proposal.details.links)
        })

        it(`should throw ForbiddenException when trying to update not own proposal`, async () => {
            const { proposal } = await setUpProposalFromIdea(app())
            const otherSessionData = await createSessionData({ username: 'other', email: 'other@example.com' })

            await expect(
                service().update(
                    proposal.blockchainProposalId,
                    proposal.networkId,
                    {
                        title: 'new title',
                    },
                    otherSessionData,
                ),
            ).rejects.toThrow(ForbiddenException)
        })

        it(`should resolve when user with proposer address assigned tries to update`, async () => {
            const { proposal } = await setUpProposalFromIdea(app())
            const proposerSessionData = await createSessionData({
                username: 'other',
                email: 'other@example.con',
                web3Addresses: [new Web3Address('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', true)],
            })

            await expect(
                service().update(
                    proposal.blockchainProposalId,
                    proposal.networkId,
                    {
                        title: 'new title',
                    },
                    proposerSessionData,
                ),
            ).resolves.toBeDefined()
        })

        it(`should throw NotFoundException when trying to update not existing proposal`, async () => {
            const {
                sessionHandler: { sessionData },
            } = await setUpProposalFromIdea(app())

            await expect(service().update(150, NETWORKS.POLKADOT, {}, sessionData)).rejects.toThrow(NotFoundException)
        })

        it(`should throw NotFoundException when trying to update a proposal created outside of the app`, async () => {
            const {
                sessionHandler: { sessionData },
            } = await setUpProposalFromIdea(app())

            await expect(service().update(2, NETWORKS.POLKADOT, {}, sessionData)).rejects.toThrow(NotFoundException)
        })

        it(`should throw BadRequestException when trying to update proposal with ${BlockchainProposalStatus.Approval}`, async () => {
            const sessionData = await createSessionData()
            const idea = await createIdea(
                {
                    details: { title: 'ideaTitle' },
                    beneficiary: uuid(),
                    networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
                },
                sessionData,
            )
            idea.milestones = []
            await ideaProposalsService().turnIdeaIntoProposal(idea, idea.networks[0], 3)
            await proposalsService().createFromIdea(idea as IdeaWithMilestones, 3, idea.networks[0])

            await expect(service().update(3, NETWORKS.POLKADOT, {}, sessionData)).rejects.toThrow(BadRequestException)
        })
    })
})
