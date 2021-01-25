import {Test} from '@nestjs/testing';
import {getRepositoryToken} from "@nestjs/typeorm";
import {Repository} from 'typeorm';
import {BlockchainService} from "../blockchain/blockchain.service";
import {IdeaDto} from "../ideas/dto/idea.dto";
import {IdeaNetwork} from "../ideas/ideaNetwork.entity";
import {IdeasService} from "../ideas/ideas.service";
import {createIdea} from "../ideas/spec.helpers";
import {getLogger} from "../logging.module";
import {beforeAllSetup, cleanDatabase} from "../utils/spec.helpers";
import {ProposalsModule} from "./proposals.module";
import {ProposalsService} from "./proposals.service";

describe('ProposalsService', () => {
    const blockchainService = {
        getProposals: () => {
            getLogger().info('Mock implementation of getproposals')
            return [
                {
                    proposalIndex: 0,
                    proposer: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                    beneficiary: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                    bond: 0.001,
                    value: 1e-14,
                    status: 'proposal',
                },
                {
                    proposalIndex: 3,
                    proposer: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
                    beneficiary: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
                    bond: 20,
                    value: 1000,
                    status: 'approval',
                }
            ]
        }
    }

    const module = beforeAllSetup(async () =>
        await Test.createTestingModule({
            imports: [ProposalsModule]
        })
            .overrideProvider(BlockchainService)
            .useValue(blockchainService)
            .compile()
    )

    const service = beforeAllSetup(() => module().get<ProposalsService>(ProposalsService))
    const ideasService = beforeAllSetup(() => module().get<IdeasService>(IdeasService))
    const ideasNetworkRepository = beforeAllSetup(() => module().get<Repository<IdeaNetwork>>(getRepositoryToken(IdeaNetwork)))

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
            const idea = await createIdea({title: 'Some title', networks: [{name: 'localhost', value: 10}]} as IdeaDto, ideasService())
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

});
