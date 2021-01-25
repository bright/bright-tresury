import {BlockchainProposalStatus} from "../blockchain/dto/blockchainProposal.dto";
import {Idea} from "../ideas/idea.entity";
import {beforeAllSetup, beforeSetupFullApp, cleanDatabase, request} from '../utils/spec.helpers';
import {ProposalDto} from "./dto/proposal.dto";
import {ProposalsService} from "./proposals.service";

const baseUrl = '/api/v1/proposals'

describe(`/api/v1/proposals`, () => {
    const app = beforeSetupFullApp()
    const proposalsService = beforeAllSetup(() => app().get<ProposalsService>(ProposalsService))
    const idea = new Idea('Title', [])

    beforeAll(() => {
        jest.spyOn(proposalsService(), 'find').mockImplementation(
            async (networkName: string) => {
                return [
                    [{
                        proposalIndex: 0,
                        proposer: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                        beneficiary: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                        bond: 0.001,
                        value: 1e-14,
                        status: BlockchainProposalStatus.Proposal
                    },
                        idea],
                    [{
                        proposalIndex: 3,
                        proposer: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
                        beneficiary: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
                        bond: 20,
                        value: 1000,
                        status: BlockchainProposalStatus.Approval,
                    }, undefined]
                ]
            })
    })

    beforeEach(async () => {
        await cleanDatabase()
    })
    describe('GET', () => {
        it('should return 200 for selected network', () => {
            return request(app())
                .get(`${baseUrl}?network=kusama`)
                .expect(200)
        })

        it('should return proposals for selected network', async () => {

            const result = await request(app())
                .get(`${baseUrl}?network=kusama`)

            expect(result.body.length).toBe(2)

            const actual1 = result.body[0] as ProposalDto
            expect(actual1.proposalIndex).toBe(0)
            expect(actual1.proposer).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(actual1.beneficiary).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(actual1.bond).toBe(0.001)
            expect(actual1.value).toBe(0.00000000000001)
            expect(actual1.status).toBe('submitted')
            expect(actual1.ideaId).toBe(idea.id)
            expect(actual1.title).toBe('Title')

            const actual2 = result.body[1] as ProposalDto
            expect(actual2.proposalIndex).toBe(3)
            expect(actual2.proposer).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
            expect(actual2.beneficiary).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
            expect(actual2.bond).toBe(20)
            expect(actual2.value).toBe(1000)
            expect(actual2.status).toBe('approved')
            expect(actual2.ideaId).toBeUndefined()
            expect(actual2.title).toBeUndefined()
        })

        it('should return 404 for empty network param', async () => {
            await request(app())
                .get(baseUrl)
                .expect(400)
        })

    })
})
