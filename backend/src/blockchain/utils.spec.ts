import {getBeneficiaries, getProposers, getVoters, transformBalance} from "./utils";
import BN from "bn.js";
import {DeriveCollectiveProposal, DeriveTreasuryProposal} from "@polkadot/api-derive/types";
import {TreasuryProposal} from "@polkadot/types/interfaces/treasury/types";
import {AccountId} from "@polkadot/types/interfaces/runtime";
import { Votes } from '@polkadot/types/interfaces/collective/types'
import {Vec} from "@polkadot/types";

const decimals = 15
const ALICE = {toHuman: () => 'Alice'} as AccountId;
const BOB = {toHuman: () => 'Bob'} as AccountId;
const CHARLIE = { toHuman: () => 'Charlie'} as AccountId;
describe('Blockchain utils', () => {
    describe('transform balance', () => {
        it('very big value', () => {
            const actual = transformBalance('6000000000000000000000000', decimals, 10)
            expect(actual).toBe(6000000000);
        });

        it('value of 1', () => {
            const actual = transformBalance('1000000000000000', decimals, 10)
            expect(actual).toBe(1);
        });

        it('very small value', () => {
            const actual = transformBalance('2', decimals, 10)
            expect(actual).toBe(0.000000000000002);
        });

        it('hex value', () => {
            const actual = transformBalance('000000000000000000b1a2bc2ec50000', decimals)
            expect(actual).toBe(50);
        });

        it('BN value', () => {
            const actual = transformBalance(new BN('000000000000000000b1a2bc2ec50000', 'hex'), decimals)
            expect(actual).toBe(50);
        });
    });

    describe('getProposers: retrieving proposers AccountID[] from DeriveTreasuryProposal[]', () => {
        it('correct retrieve 2 AccountId objects', () => {
            const mockDeriveTreasuryProposal = (proposer: AccountId) => ({proposal: {proposer} as TreasuryProposal} as DeriveTreasuryProposal)
            const deriveTreasuryProposals = [mockDeriveTreasuryProposal(ALICE), mockDeriveTreasuryProposal(BOB)];
            const output = getProposers(deriveTreasuryProposals);
            expect(output).toEqual([ALICE, BOB])
            expect(output[0].toHuman()).toBe('Alice')
            expect(output[1].toHuman()).toBe('Bob')
        })
        it('correctly returns empty array', () => {
            expect(getProposers([])).toEqual([]);
        })
    })
    describe('getBeneficiaries: retrieving proposers AccountID[] from DeriveTreasuryProposal[]:', () => {
        it ('correctly retrieve 2 AccountId objectes', () => {
            const mockDeriveTreasuryProposal = (beneficiary: AccountId) => ({proposal: { beneficiary } as TreasuryProposal } as DeriveTreasuryProposal)
            const deriveTreasuryProposals = [ mockDeriveTreasuryProposal(ALICE), mockDeriveTreasuryProposal(BOB) ];
            const output = getBeneficiaries(deriveTreasuryProposals);
            expect(output).toEqual([ALICE, BOB])
            expect(output[0].toHuman()).toBe('Alice')
            expect(output[1].toHuman()).toBe('Bob')
        })
        it('correctly returns empty array', () => {
            expect(getBeneficiaries([])).toEqual([]);
        })
    })

    describe('getVoters: retrieving proposers AccountID[] from DeriveTreasuryProposal[]:', () => {
        const mockDeriveTreasuryProposal = (council: DeriveCollectiveProposal[]) => ({council} as DeriveTreasuryProposal)
        const toVec = (accountIds: AccountId[]): Vec<AccountId> => ({ toArray: () => accountIds} as Vec<AccountId>);
        it('returns empty array', () => {
            const councilEmptyArray = [] as DeriveCollectiveProposal[]; // no motion
            expect(getVoters([mockDeriveTreasuryProposal(councilEmptyArray)])).toEqual([]);
        })
        it('handle null council', () => {
            const councilNullVotes = [{votes: null}] as DeriveCollectiveProposal[]; // one motion - votes null
            expect(getVoters([mockDeriveTreasuryProposal(councilNullVotes)])).toEqual([]);
        })
        it('handle one proposal with one motion', () => {
            const councilSingleMotion = [
                {votes: { ayes: toVec([BOB]), nays: toVec([CHARLIE])} as Votes}
            ] as DeriveCollectiveProposal[]; // one motion with ayes and nays votes
            const singleMotionVoters = getVoters([mockDeriveTreasuryProposal(councilSingleMotion)]);
            expect(singleMotionVoters.length).toBe(2);
            expect(singleMotionVoters).toEqual(expect.arrayContaining([BOB, CHARLIE]))
        })
        it('handle one proposal with two motions', () => {
            const councilTwoMotion = [
                {votes: { ayes: toVec([ALICE]) } },
                {votes: { ayes: toVec([BOB]), nays: toVec([CHARLIE]) } }
            ] as DeriveCollectiveProposal[];
            const twoMotionVoters = getVoters([mockDeriveTreasuryProposal(councilTwoMotion)])
            expect(twoMotionVoters.length).toBe(3);
            expect(twoMotionVoters).toEqual(
                expect.arrayContaining([ALICE, BOB, CHARLIE])
            );
        })

        it('handle 2 proposals with three motions', () => {
            const councilSingleMotion = [
                {votes: { ayes: toVec([BOB]), nays: toVec([CHARLIE])} as Votes}
            ] as DeriveCollectiveProposal[]; // one motion with ayes and nays votes
            const councilTwoMotion = [
                {votes: { ayes: toVec([ALICE]) } },
                {votes: { ayes: toVec([BOB]), nays: toVec([CHARLIE]) } }
            ] as DeriveCollectiveProposal[];
            const twoProposalsVoters = getVoters([
                mockDeriveTreasuryProposal(councilSingleMotion),
                mockDeriveTreasuryProposal(councilTwoMotion),
            ]);
            expect(twoProposalsVoters.length).toBe(3);
            expect(twoProposalsVoters).toEqual(
                expect.arrayContaining([ALICE, BOB, CHARLIE])
            );
        })
    });
})
