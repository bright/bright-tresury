import {Test} from "@nestjs/testing";
import {Keyring, SubmittableResult} from "@polkadot/api";
import ApiPromise from "@polkadot/api/promise";
import {KeyringPair} from "@polkadot/keyring/types";
import {UpdateExtrinsicDto} from "../extrinsics/dto/updateExtrinsic.dto";
import {beforeAllSetup} from "../utils/spec.helpers";
import {BlockchainModule} from "./blockchain.module";
import BN from 'bn.js';
import {BlockchainService} from "./blockchain.service";
import {BN_TEN} from "./utils";

describe(`Blockchain service`, () => {
    // TODO fix types!
    // @ts-ignore
    let api: ApiPromise
    let keyring: Keyring
    let aliceKeypair: KeyringPair
    const aliceAddress = '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5'
    const bobAddress = '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3'

    const module = beforeAllSetup(async () =>
        await Test.createTestingModule({
            imports: [BlockchainModule]
        }).compile()
    )

    const service = beforeAllSetup(() => module().get<BlockchainService>(BlockchainService))

    beforeEach(async () => {
        api = await service().getApi()
        keyring = new Keyring({type: 'sr25519'});
        aliceKeypair = keyring.addFromUri('//Alice', {name: 'Alice default'});
    })
    //
    // describe('findExtrinsic', () => {
    //     it('should start listening and find proposeSpend extrinsic with events', async (done) => {
    //         let expectedBlockHash = ''
    //         let expectedProposalId = 0
    //
    //         // create and sign extrinsic
    //         const extrinsic = api.tx.treasury.proposeSpend(10, bobAddress)
    //         await extrinsic.signAsync(aliceKeypair)
    //
    //         // start listening for the extrinsic
    //         await service().listenForExtrinsic(extrinsic.hash.toString(), async (result: UpdateExtrinsicDto) => {
    //             expect(result).toBeDefined()
    //             expect(result!.blockHash).toBe(expectedBlockHash)
    //             expect(result!.events).toContainEqual({
    //                 section: 'treasury',
    //                 method: 'Proposed',
    //                 data: [{
    //                     name: 'ProposalIndex',
    //                     value: `${expectedProposalId}`
    //                 }]
    //             })
    //             expect(result!.events).toContainEqual({
    //                 section: 'balances',
    //                 method: 'Reserved',
    //                 data: [
    //                     {
    //                         name: 'AccountId',
    //                         value: aliceAddress
    //                     },
    //                     {
    //                         name: 'Balance',
    //                         value: '1000000000000'
    //                     }]
    //             })
    //             expect(result!.data).toStrictEqual({
    //                 value: 10,
    //                 beneficiary: {
    //                     Id: bobAddress
    //                 }
    //             })
    //             done()
    //         })
    //
    //         // send the extrinsic
    //         await extrinsic.send((result: any) => {
    //             if (result.isFinalized) {
    //                 // TODO fix types
    //                 expectedBlockHash = result.status.asFinalized.toString()
    //                 const event = result.events
    //                     .find(({event: e}: { event: any }) => e.section === 'treasury' && e.method === 'Proposed')
    //                 expectedProposalId = Number(event?.event.data[0])
    //             }
    //         })
    //     }, 60000)
    //
    //     it('should start listening and find successful extrinsic with exceptions', async (done) => {
    //         let expectedBlockHash = ''
    //
    //         // create and sign extrinsic which will fail as only ApproveOrigin can call this extrinsic
    //         const extrinsic = api.tx.treasury.rejectProposal(0)
    //         await extrinsic.signAsync(aliceKeypair)
    //
    //         // start listening for the extrinsic
    //         await service().listenForExtrinsic(extrinsic.hash.toString(), async (result: UpdateExtrinsicDto) => {
    //             expect(result).toBeDefined()
    //             expect(result!.blockHash).toBe(expectedBlockHash)
    //             const errorEvent = result!.events.find((e) => e.section === 'system' && e.method === 'ExtrinsicFailed')
    //             expect(errorEvent).toBeDefined()
    //             expect(errorEvent!.data).toContainEqual({
    //                 name: 'DispatchError',
    //                 value: 'BadOrigin'
    //             })
    //             done()
    //         })
    //
    //         // send the extrinsic
    //         await extrinsic.send((result: SubmittableResult) => {
    //             if (result.isFinalized) {
    //                 expectedBlockHash = result.status.asFinalized.toString()
    //             }
    //         })
    //     }, 60000)
    // })

    describe('getProposals', () => {
        it('should return existing proposals', async (done) => {
            // create a proposal
            const nextProposalIndex = (await api.query.treasury.proposalCount()).toNumber()
            const extrinsic = api.tx.treasury.proposeSpend(BN_TEN.pow(new BN(18)), bobAddress)
            await extrinsic.signAndSend(aliceKeypair, async (result: SubmittableResult) => {
                if (result.isFinalized) {
                    const proposals = await service().getProposals()
                    expect(proposals.length).toBeGreaterThan(0)
                    const lastProposal = proposals.find((p) => p.proposalIndex === nextProposalIndex)!
                    expect(lastProposal.proposalIndex).toBe(nextProposalIndex)
                    expect(lastProposal.proposer).toBe(aliceAddress)
                    expect(lastProposal.beneficiary).toBe(bobAddress)
                    expect(lastProposal.bond).toBe(50)
                    expect(lastProposal.value).toBe(1000)
                    done()
                }
            })
        }, 60000)
    })
});
