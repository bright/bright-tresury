import {getRepositoryToken} from "@nestjs/typeorm";
import {Repository} from 'typeorm';
import {BlockchainService} from "../blockchain/blockchain.service";
import {IdeaDto} from "../ideas/dto/idea.dto";
import {IdeaNetwork} from "../ideas/entities/ideaNetwork.entity";
import {IdeasService} from "../ideas/ideas.service";
import {createIdea, createSessionData} from "../ideas/spec.helpers";
import {beforeAllSetup, beforeSetupFullApp, cleanDatabase} from "../utils/spec.helpers";
import {ProposalsService} from "./proposals.service";
import {mockedBlockchainService} from "./spec.helpers";

describe('ProposalsService', () => {
    const app = beforeSetupFullApp()

    const service = beforeAllSetup(() => app().get<ProposalsService>(ProposalsService))
    const ideasService = beforeAllSetup(() => app().get<IdeasService>(IdeasService))
    const ideasNetworkRepository = beforeAllSetup(() => app().get<Repository<IdeaNetwork>>(getRepositoryToken(IdeaNetwork)))

    beforeAll(() => {
        jest.spyOn(app().get(BlockchainService), 'getProposals').mockImplementation(
            mockedBlockchainService.getProposals
        )
    })

    beforeEach(async () => {
        await cleanDatabase()
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('find', () => {
        it('should return proposals', async () => {
            const actual = await service().find('localhost')
            expect(actual.length).toBe(2)

            const [proposal1] = actual[0]
            expect(proposal1.proposalIndex).toBe(0)
            expect(proposal1.proposer).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(proposal1.beneficiary).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(proposal1.bond).toBe(0.001)
            expect(proposal1.value).toBe(0.00000000000001)
            expect(proposal1.status).toBe('proposal')

            const [proposal2] = actual[1]
            expect(proposal2.proposalIndex).toBe(3)
            expect(proposal2.proposer).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
            expect(proposal2.beneficiary).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
            expect(proposal2.bond).toBe(20)
            expect(proposal2.value).toBe(1000)
            expect(proposal2.status).toBe('approval')
        })

        it('should return idea details for proposals', async () => {
            const user = await createSessionData()
            const idea = await createIdea({title: 'Some title', networks: [{name: 'localhost', value: 10}]} as IdeaDto, user, ideasService())
            idea.networks[0].blockchainProposalId = 0
            await ideasNetworkRepository().save(idea.networks[0])

            const actual = await service().find('localhost')

            const [proposal1, idea1] = actual[0]
            expect(proposal1.proposalIndex).toBe(0)
            expect(idea1!.id).toBe(idea.id)
            expect(idea1!.title).toBe('Some title')

            const [proposal2, idea2] = actual[1]
            expect(proposal2.proposalIndex).toBe(3)
            expect(idea2).toBe(undefined)
        })
    })

    describe('findOne', () => {
        it('should return proposal details', async () => {
            const [actual] = await service().findOne(0, 'localhost')

            expect(actual.proposalIndex).toBe(0)
            expect(actual.proposer).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(actual.beneficiary).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(actual.bond).toBe(0.001)
            expect(actual.value).toBe(0.00000000000001)
            expect(actual.status).toBe('proposal')
        })

        it('should return idea details', async () => {
            const user = await createSessionData()
            const idea = await createIdea(
                {title: 'Some title', content: 'Content', networks: [{name: 'localhost', value: 10}]} as IdeaDto,
                user,
                ideasService())
            idea.networks[0].blockchainProposalId = 0
            await ideasNetworkRepository().save(idea.networks[0])

            const [proposal, actual] = await service().findOne(0, 'localhost')

            expect(actual!.id).toBe(idea.id)
            expect(actual!.title).toBe('Some title')
            expect(actual!.content).toBe('Content')
        })

        it('should return empty idea', async () => {
            const [proposal, actual] = await service().findOne(3, 'localhost')

            expect(actual).toBeUndefined()
        })
    })
});
