import { ProposalDto, ProposalStatus } from '../proposals.dto'
import { ProposalFilter } from '../useProposalsFilter'
import { filterProposals, isProposalMadeByUser } from './filterProposals'
import { AuthContextUser } from '../../auth/AuthContext'

describe('filter proposals', () => {
    test('filter proposals by all', () => {
        const proposals = [
            createProposal(ProposalStatus.Approved),
            createProposal(ProposalStatus.Submitted),
            createProposal(ProposalStatus.Closed),
        ]

        expect(filterProposals(proposals, ProposalFilter.All)).toStrictEqual([proposals[0], proposals[1], proposals[2]])
    })
    test('filter proposals by approved', () => {
        const proposals = [
            createProposal(ProposalStatus.Approved),
            createProposal(ProposalStatus.Submitted),
            createProposal(ProposalStatus.Closed),
            createProposal(ProposalStatus.Approved),
        ]

        expect(filterProposals(proposals, ProposalFilter.Approved)).toStrictEqual([proposals[0], proposals[3]])
    })
    test('filter proposals by submitted', () => {
        const proposals = [
            createProposal(ProposalStatus.Approved),
            createProposal(ProposalStatus.Submitted),
            createProposal(ProposalStatus.Closed),
            createProposal(ProposalStatus.Submitted),
        ]

        expect(filterProposals(proposals, ProposalFilter.Submitted)).toStrictEqual([proposals[1], proposals[3]])
    })
})

function createProposal(status: ProposalStatus, ownerId?: string, proposerAddress?: string): ProposalDto {
    return {
        status: status,
        ownerId: ownerId,
        proposer: { address: proposerAddress },
    } as ProposalDto
}

describe(`filter by ${ProposalFilter.Mine}`, () => {
    const user: AuthContextUser = {
        id: 'df03924f-a9d5-4920-bd40-a56ebfd1ae22',
        username: 'Example',
        email: 'example@example.com',
        isEmailVerified: true,
        isEmailPassword: true,
        isWeb3: true,
        web3Addresses: [
            {
                encodedAddress: '1H6V3BJ6r1wU8BScdT4NwmmXCXAQFSqRCMDsFsGTpgnjCd47',
                address: '1H6V3BJ6r1wU8BScdT4NwmmXCXAQFSqRCMDsFsGTpgnjCd47',
                isPrimary: true,
            },
        ],
    }

    const otherUser: AuthContextUser = {
        id: 'f847a9de-e640-460a-bd1f-0eaeb4f6da5b',
        username: 'Example',
        email: 'example@example.com',
        isEmailVerified: true,
        isEmailPassword: true,
        isWeb3: true,
        web3Addresses: [
            {
                encodedAddress: '1O6V3BJ6r1wU1BScdT4NwwwyYZYWQFSqRCMDsFsGTpgnjCd92',
                address: '1O6V3BJ6r1wU1BScdT4NwwwyYZYWQFSqRCMDsFsGTpgnjCd92',
                isPrimary: true,
            },
        ],
    }

    it(`should return proposals owned by the given user by owner id`, () => {
        const proposals = [
            createProposal(ProposalStatus.Approved, user.id, undefined),
            createProposal(ProposalStatus.Rewarded, otherUser.id, undefined),
        ]

        expect(filterProposals(proposals, ProposalFilter.Mine, user)).toStrictEqual([proposals[0]])
    })

    it(`should not return proposals owned by the given otherUser by owner id`, () => {
        const proposals = [createProposal(ProposalStatus.Approved, user.id, undefined)]

        expect(filterProposals(proposals, ProposalFilter.Mine, otherUser)).toStrictEqual([])
    })

    it(`should return only proposals owned by the given user by owner id`, () => {
        const proposals = [
            createProposal(ProposalStatus.Approved, user.id, undefined),
            createProposal(ProposalStatus.Rewarded, otherUser.id, undefined),
        ]

        expect(filterProposals(proposals, ProposalFilter.Mine, otherUser)).toStrictEqual([proposals[1]])
    })

    it(`should not return any proposals when user is undefined`, () => {
        const proposals = [createProposal(ProposalStatus.Rejected, undefined, user.web3Addresses[0].address)]

        expect(filterProposals(proposals, ProposalFilter.Mine, undefined)).toStrictEqual([])
    })
})

describe(`isProposalMadeByUser`, () => {
    const user: AuthContextUser = {
        id: 'df03924f-a9d5-4920-bd40-a56ebfd1ae22',
        username: 'Example',
        email: 'example@example.com',
        isEmailVerified: true,
        isEmailPassword: true,
        isWeb3: true,
        web3Addresses: [
            {
                encodedAddress: '1H6V3BJ6r1wU8BScdT4NwmmXCXAQFSqRCMDsFsGTpgnjCd47',
                address: '1H6V3BJ6r1wU8BScdT4NwmmXCXAQFSqRCMDsFsGTpgnjCd47',
                isPrimary: true,
            },
        ],
    }

    const otherUser: AuthContextUser = {
        id: 'f847a9de-e640-460a-bd1f-0eaeb4f6da5b',
        username: 'Example',
        email: 'example@example.com',
        isEmailVerified: true,
        isEmailPassword: true,
        isWeb3: true,
        web3Addresses: [
            {
                encodedAddress: '1O6V3BJ6r1wU1BScdT4NwwwyYZYWQFSqRCMDsFsGTpgnjCd92',
                address: '1O6V3BJ6r1wU1BScdT4NwwwyYZYWQFSqRCMDsFsGTpgnjCd92',
                isPrimary: true,
            },
        ],
    }

    it(`should return true if proposal made by user with web3address`, () => {
        const proposal = {
            proposer: { address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, user)).toStrictEqual(true)
    })

    it(`should return false if proposal made by otherUser with web3address`, () => {
        const proposal = {
            proposer: { address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, otherUser)).toStrictEqual(false)
    })

    it(`should return false if proposal made by undefined user with web3address`, () => {
        const proposal = {
            proposer: { address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, undefined)).toStrictEqual(false)
    })

    it(`should return true if proposal made by user without web3address`, () => {
        const proposal = {
            ownerId: user.id,
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, user)).toStrictEqual(true)
    })

    it(`should return false if proposal made by otherUser without web3address`, () => {
        const proposal = {
            ownerId: user.id,
            proposer: {},
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, otherUser)).toStrictEqual(false)
    })

    it(`should return false if proposal made by undefined user without web3address`, () => {
        const proposal = {
            ownerId: user.id,
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, undefined)).toStrictEqual(false)
    })

    it(`should return true if proposal is made by user`, () => {
        const proposal = {
            ownerId: user.id,
            proposer: { address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, user)).toStrictEqual(true)
    })

    it(`should return false if proposal is made by otherUser`, () => {
        const proposal = {
            ownerId: user.id,
            proposer: { address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, otherUser)).toStrictEqual(false)
    })

    it(`should return false if proposal is made by undefined user`, () => {
        const proposal = {
            ownerId: user.id,
            proposer: { address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, undefined)).toStrictEqual(false)
    })

    it(`should return true if proposal have user in ownerId and otherUser in proposer`, () => {
        const proposal = {
            ownerId: user.id,
            proposer: { address: otherUser.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, user)).toStrictEqual(true)
    })

    it(`should return true if proposal have in user ownerId and otherUser in proposer when user is otherUser`, () => {
        const proposal = {
            ownerId: user.id,
            proposer: { address: otherUser.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, otherUser)).toStrictEqual(true)
    })

    it(`should return false if proposal have in user ownerId and otherUser in proposer when user is undefined`, () => {
        const proposal = {
            ownerId: user.id,
            proposer: { address: otherUser.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, undefined)).toStrictEqual(false)
    })

    it(`should return true if proposal have otherUser in ownerId and user in proposer`, () => {
        const proposal = {
            ownerId: otherUser.id,
            proposer: { address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, user)).toStrictEqual(true)
    })

    it(`should return true if proposal have otherUser in ownerId and user in proposer when user is otherUser`, () => {
        const proposal = {
            ownerId: otherUser.id,
            proposer: { address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, otherUser)).toStrictEqual(true)
    })

    it(`should return false if proposal have otherUser in ownerId and user in proposer when user is undefined`, () => {
        const proposal = {
            ownerId: otherUser.id,
            proposer: { address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, undefined)).toStrictEqual(false)
    })

    it(`should return false when proposal is empty`, () => {
        const proposal = {
            proposer: {},
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, user)).toStrictEqual(false)
    })

    it(`should return false when proposal is empty and user is otherUser`, () => {
        const proposal = {
            proposer: {},
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, otherUser)).toStrictEqual(false)
    })

    it(`should return false when proposal is empty and user is user`, () => {
        const proposal = {
            proposer: {},
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, undefined)).toStrictEqual(false)
    })

    it(`should return false if proposer is made by otherUser`, () => {
        const proposal = {
            proposer: { address: otherUser.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, user)).toStrictEqual(false)
    })

    it(`should return true if proposer is made by otherUser and user is otherUser`, () => {
        const proposal = {
            proposer: { address: otherUser.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, otherUser)).toStrictEqual(true)
    })

    it(`should return false if proposer is made by otherUser and user is undefined`, () => {
        const proposal = {
            proposer: { address: otherUser.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, undefined)).toStrictEqual(false)
    })

    it(`should return false if proposal is made by otherUser without proposer and user is user`, () => {
        const proposal = {
            ownerId: otherUser.id,
            proposer: {},
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, user)).toStrictEqual(false)
    })

    it(`should return true if proposal is made by otherUser without proposer and user is otherUser`, () => {
        const proposal = {
            ownerId: otherUser.id,
            proposer: {},
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, otherUser)).toStrictEqual(true)
    })

    it(`should return false if proposal is made by otherUser without proposer and user is undefined`, () => {
        const proposal = {
            ownerId: otherUser.id,
            proposer: {},
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, undefined)).toStrictEqual(false)
    })
})
