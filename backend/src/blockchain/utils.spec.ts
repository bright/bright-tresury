import {getBeneficiaries, getProposers, getVoters, transformBalance} from "./utils";
import BN from "bn.js";
import {DeriveCollectiveProposal, DeriveTreasuryProposal} from "@polkadot/api-derive/types";
import {TreasuryProposal} from "@polkadot/types/interfaces/treasury/types";
import {AccountId} from "@polkadot/types/interfaces/runtime";
import { Votes } from '@polkadot/types/interfaces/collective/types'
import {Vec} from "@polkadot/types";

const decimals = 15

describe('transform balance', () => {
    test('very big value', () => {
        const actual = transformBalance('6000000000000000000000000', decimals, 10)
        expect(actual).toBe(6000000000);
    });

    test('value of 1', () => {
        const actual = transformBalance('1000000000000000', decimals, 10)
        expect(actual).toBe(1);
    });

    test('very small value', () => {
        const actual = transformBalance('2', decimals, 10)
        expect(actual).toBe(0.000000000000002);
    });

    test('hex value', () => {
        const actual = transformBalance('000000000000000000b1a2bc2ec50000', decimals)
        expect(actual).toBe(50);
    });

    test('BN value', () => {
        const actual = transformBalance(new BN('000000000000000000b1a2bc2ec50000', 'hex'), decimals)
        expect(actual).toBe(50);
    });

    test('getProposers', () => {
        const alice = {toHuman: () => 'Alice'} as AccountId;
        const bob = { toHuman: () => 'Bob'} as AccountId;
        const mockDeriveTreasuryProposal = (proposer: AccountId) => ({proposal: { proposer } as TreasuryProposal } as DeriveTreasuryProposal)
        const deriveTreasuryProposals = [ mockDeriveTreasuryProposal(alice), mockDeriveTreasuryProposal(bob) ];
        const output = getProposers(deriveTreasuryProposals);
        expect(output).toEqual([alice, bob])
        expect(output[0].toHuman()).toBe('Alice')
        expect(output[1].toHuman()).toBe('Bob')

        expect(getProposers([])).toEqual([]);
    })

    test('getBeneficiaries', () => {
        const alice = { toHuman: () => 'Alice'} as AccountId;
        const bob = { toHuman: () => 'Bob'} as AccountId;
        const mockDeriveTreasuryProposal = (beneficiary: AccountId) => ({proposal: { beneficiary } as TreasuryProposal } as DeriveTreasuryProposal)
        const deriveTreasuryProposals = [ mockDeriveTreasuryProposal(alice), mockDeriveTreasuryProposal(bob) ];
        const output = getBeneficiaries(deriveTreasuryProposals);
        expect(output).toEqual([alice, bob])
        expect(output[0].toHuman()).toBe('Alice')
        expect(output[1].toHuman()).toBe('Bob')

        expect(getBeneficiaries([])).toEqual([]);
    })

    test('getVoters', () => {
        const mockDeriveTreasuryProposal = (council: DeriveCollectiveProposal[]) => ({council} as DeriveTreasuryProposal)
        const toVec = (accountIds: AccountId[]): Vec<AccountId> => ({ toArray: () => accountIds} as Vec<AccountId>);
        const alice = { toHuman: () => 'Alice'} as AccountId;
        const bob = { toHuman: () => 'Bob'} as AccountId;
        const charlie = { toHuman: () => 'Charlie'} as AccountId;

        const councilEmptyArray = [] as DeriveCollectiveProposal[]; // no motion
        const councilNullVotes = [{votes: null}] as DeriveCollectiveProposal[]; // one motion - votes null
        const councilSingleMotion = [
            {votes: { ayes: toVec([bob]), nays: toVec([charlie])} as Votes}
        ] as DeriveCollectiveProposal[]; // one motion with ayes and nays votes
        const councilTwoMotion = [
            {votes: { ayes: toVec([alice]) } },
            {votes: { ayes: toVec([bob]), nays: toVec([charlie]) } }
        ] as DeriveCollectiveProposal[];

        expect(getVoters([mockDeriveTreasuryProposal(councilEmptyArray)])).toEqual([]);
        expect(getVoters([mockDeriveTreasuryProposal(councilNullVotes)])).toEqual([]);

        const singleMotionVoters = getVoters([mockDeriveTreasuryProposal(councilSingleMotion)]);
        expect(singleMotionVoters.length).toBe(2);
        expect(singleMotionVoters).toEqual(expect.arrayContaining([bob,charlie]))

        const twoMotionVoters = getVoters([mockDeriveTreasuryProposal(councilTwoMotion)])
        expect(twoMotionVoters.length).toBe(3);
        expect(twoMotionVoters).toEqual(
            expect.arrayContaining([alice, bob, charlie])
        );

        const twoProposalsVoters = getVoters([
            mockDeriveTreasuryProposal(councilSingleMotion),
            mockDeriveTreasuryProposal(councilTwoMotion),
        ]);
        expect(twoMotionVoters.length).toBe(3);
        expect(twoMotionVoters).toEqual(
            expect.arrayContaining([alice, bob, charlie])
        );
    })
})
