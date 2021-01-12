import {Test} from "@nestjs/testing";
import {Keyring, SubmittableResult} from "@polkadot/api";
import ApiPromise from "@polkadot/api/promise";
import {KeyringPair} from "@polkadot/keyring/types";
import {UpdateExtrinsicDto} from "../extrinsics/dto/updateExtrinsic.dto";
import {beforeAllSetup} from "../utils/spec.helpers";
import {BlockchainModule} from "./blockchain.module";
import BN from 'bn.js';
import {BlockchainService} from "./blockchain.service";

describe(`Blockchain service`, () => {
    // TODO fix types!
    // @ts-ignore
    let api: ApiPromise
    let keyring: Keyring
    let pair: KeyringPair

    const module = beforeAllSetup(async () =>
        await Test.createTestingModule({
            imports: [BlockchainModule]
        }).compile()
    )

    const service = beforeAllSetup(() => module().get<BlockchainService>(BlockchainService))

    beforeEach(async () => {
        api = await service().getApi()
        keyring = new Keyring({type: 'sr25519'});
        pair = keyring.addFromUri('//Alice', {name: 'Alice default'});
    })

    describe('findExtrinsic', () => {
        it('should start listening and find extrinsic with events', async (done) => {
            let expectedBlockHash = ''
            let expectedProposalId = 0

            // create and sign extrinsic
            const extrinsic = api.tx.treasury.proposeSpend(10, '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            await extrinsic.signAsync(pair)

            // start listening for the extrinsic
            await service().listenForExtrinsic(extrinsic.hash.toString(), (result: UpdateExtrinsicDto) => {
                expect(result).toBeDefined()
                expect(result!.blockHash).toBe(expectedBlockHash)
                expect(result!.events).toContainEqual({
                    section: 'treasury',
                    method: 'Proposed',
                    data: [{
                        name: 'ProposalIndex',
                        value: `${expectedProposalId}`
                    }]
                })
                done()
            })

            // send the extrinsic
            await extrinsic.send((result: any) => {
                if (result.isFinalized) {
                    // TODO fix types
                    expectedBlockHash = result.status.asFinalized.toString()
                    const event = result.events
                        .find(({event: e}: { event: any }) => e.section === 'treasury' && e.method === 'Proposed')
                    expectedProposalId = Number(event?.event.data[0])
                }
            })
        }, 60000)

        it('should start listening and find successful extrinsic with errors', async (done) => {
            let expectedBlockHash = ''

            // create and sign extrinsic which will fail as only ApproveOrigin can call this extrinsic
            const extrinsic = api.tx.treasury.rejectProposal(0)
            await extrinsic.signAsync(pair)

            // start listening for the extrinsic
            await service().listenForExtrinsic(extrinsic.hash.toString(), (result: UpdateExtrinsicDto) => {
                expect(result).toBeDefined()
                expect(result!.blockHash).toBe(expectedBlockHash)
                const errorEvent = result!.events.find((e) => e.section === 'system' && e.method === 'ExtrinsicFailed')
                expect(errorEvent).toBeDefined()
                expect(errorEvent!.data).toContainEqual({
                    name: 'DispatchError',
                    value: 'BadOrigin'
                })
                done()
            })

            // send the extrinsic
            await extrinsic.send((result: SubmittableResult) => {
                if (result.isFinalized) {
                    expectedBlockHash = result.status.asFinalized.toString()
                }
            })
        }, 60000)
    })

    describe.only('getProposals', () => {
        it('should return existing proposals', async (done) => {
            // create a proposal
            const nextProposalIndex  = (await api.query.treasury.proposalCount()).toNumber()
            const extrinsic = api.tx.treasury.proposeSpend(10, '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            await extrinsic.signAndSend(pair, async(result: SubmittableResult) => {
                if (result.isFinalized) {
                    const proposals = await service().getProposals()
                    expect(proposals.length).toBeGreaterThan(0)
                    const lastProposal = proposals[proposals.length - 1]
                    expect(lastProposal.proposalIndex).toBe(nextProposalIndex)
                    expect(lastProposal.proposer).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
                    expect(lastProposal.beneficiary).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
                    expect(lastProposal.bond.eq(new BN(1000000000000))).toBe(true)
                    expect(lastProposal.value.eq(new BN(10))).toBe(true)
                    done()
                }
            })
        }, 60000)
    })
});
