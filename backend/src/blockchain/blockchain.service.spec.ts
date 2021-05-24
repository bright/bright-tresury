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
import {ApiTypes} from '@polkadot/api/types'
import {SubmittableExtrinsic} from "@polkadot/api/submittable/types";

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
        api = await service().getApi();
        keyring = new Keyring({type: 'sr25519'});
        aliceKeypair = keyring.addFromUri('//Alice', {name: 'Alice default'});
    })

    describe('findExtrinsic', () => {
        it('should start listening and find proposeSpend extrinsic with events', async (done) => {
            let expectedBlockHash = ''
            let expectedProposalId = 0

            // create and sign extrinsic
            const extrinsic = api.tx.treasury.proposeSpend(10, bobAddress)
            await extrinsic.signAsync(aliceKeypair)

            // start listening for the extrinsic
            await service().listenForExtrinsic(extrinsic.hash.toString(), async (result: UpdateExtrinsicDto) => {
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
                expect(result!.events).toContainEqual({
                    section: 'balances',
                    method: 'Reserved',
                    data: [
                        {
                            name: 'AccountId',
                            value: aliceAddress
                        },
                        {
                            name: 'Balance',
                            value: '1000000000000'
                        }]
                })
                expect(result!.data).toStrictEqual({
                    value: 10,
                    beneficiary: {
                        id: bobAddress
                    }
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

        it('should start listening and find successful extrinsic with exceptions', async (done) => {
            let expectedBlockHash = ''

            // create and sign extrinsic which will fail as only ApproveOrigin can call this extrinsic
            const extrinsic = api.tx.treasury.rejectProposal(0)
            await extrinsic.signAsync(aliceKeypair)

            // start listening for the extrinsic
            await service().listenForExtrinsic(extrinsic.hash.toString(), async (result: UpdateExtrinsicDto) => {
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

    const signAndSend = (extrinsic: SubmittableExtrinsic<ApiTypes>, keyringPair: KeyringPair): Promise<SubmittableResult> =>
        new Promise((resolve) => {
            extrinsic.signAndSend(keyringPair, (result: SubmittableResult) => {
                if (result.isFinalized) {
                    resolve(result)
                }
            })
    })

    const randomString = (): string => Math.random().toString(36).substring(7);

    describe('getIdentities', () => {
        it ('should return Alice identity', async () => {
            const displayRaw = randomString();
            const extrinsic = api.tx.identity.setIdentity({display: {Raw: displayRaw}})
            await signAndSend(extrinsic, aliceKeypair);
            const identities = await service().getIdentities([aliceAddress]);
            expect(identities.get(aliceAddress)?.display).toBe(displayRaw);
        }, 60000)
    })
    describe('getRemainingTime', () => {
        it(' ', async (done) => {
            const currentBlockNumber = await api.derive.chain.bestNumber();
            const futureBlockNumber = currentBlockNumber.add(new BN(1));
            const {endBlock, remainingBlocks, timeLeft} = service().getRemainingTime(currentBlockNumber,futureBlockNumber);
            expect(endBlock).toBe(futureBlockNumber.toNumber());
            expect(remainingBlocks).toBe(1);
            expect(timeLeft?.seconds).toBe(6); // assuming that time for one block is 6 seconds
            done();
        }, 60000)
    })
    describe('getProposals', () => {
        it('should return existing proposals', async (done) => {
            // create a proposal
            const setIdentityExtrinsic = api.tx.identity.setIdentity({display: {Raw: 'Alice'}})
            await signAndSend(setIdentityExtrinsic, aliceKeypair);
            const nextProposalIndex = (await api.query.treasury.proposalCount()).toNumber()
            const extrinsic = api.tx.treasury.proposeSpend(BN_TEN.pow(new BN(18)), bobAddress)
            await signAndSend(extrinsic, aliceKeypair);
            const proposals = await service().getProposals()
            expect(proposals.length).toBeGreaterThan(0)
            const lastProposal = proposals.find((p) => p.proposalIndex === nextProposalIndex)!
            expect(lastProposal.proposalIndex).toBe(nextProposalIndex)
            expect(lastProposal.proposer.address).toBe(aliceAddress)
            expect(lastProposal.proposer.display).toBe('Alice')
            expect(lastProposal.beneficiary.address).toBe(bobAddress)
            expect(lastProposal.bond).toBe(50)
            expect(lastProposal.value).toBe(1000)
            done()
        }, 60000)
    })
});
