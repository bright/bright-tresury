import {Test} from '@nestjs/testing';
import BN from "bn.js";
import {BlockchainService} from "../blockchain/blockchain.service";
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
                    bond: 0.001, // 0.001 units
                    value: 1e-14, // FIXME: 10^(-14) units
                },
                {
                    proposalIndex: 3,
                    proposer: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
                    beneficiary: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
                    bond: 20, // 20 units
                    value: 1000, // 1000 units
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

    beforeEach(async () => {
        await cleanDatabase()
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('find', () => {
        it('should return proposals', async () => {
            const actual = await service().find()
            expect(actual.length).toBe(2)

            const actual1 = actual[0]
            expect(actual1.proposalIndex).toBe(0)
            expect(actual1.proposer).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(actual1.beneficiary).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(actual1.bond).toBe(0.001)
            expect(actual1.value).toBe(0.00000000000001)
            expect(actual1.status).toBe('submitted')
            // expect(actual1.ideaId).toBe('xxx')
            // expect(actual1.title).toBe('Title')

            const actual2 = actual[1]
            expect(actual2.proposalIndex).toBe(3)
            expect(actual2.proposer).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
            expect(actual2.beneficiary).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
            expect(actual2.bond).toBe(20)
            expect(actual2.value).toBe(1000)
            expect(actual2.status).toBe('submitted')
            // expect(actual2.ideaId).toBe('xxx')
            // expect(actual2.title).toBe('Title')
        })
    })
});
