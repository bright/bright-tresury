import { AuthContextUser, UserStatus } from '../../auth/AuthContext'
import { ProposalDto } from '../proposals.dto'
import { isProposalMadeByUser } from './filterProposals'

describe(`isProposalMadeByUser`, () => {
    const user: AuthContextUser = {
        id: 'df03924f-a9d5-4920-bd40-a56ebfd1ae22',
        username: 'Example',
        email: 'example@example.com',
        isEmailVerified: true,
        status: UserStatus.EmailPasswordEnabled,
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
        status: UserStatus.EmailPasswordEnabled,
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
            proposer: { web3address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, user)).toStrictEqual(true)
    })

    it(`should return false if proposal made by otherUser with web3address`, () => {
        const proposal = {
            proposer: { web3address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, otherUser)).toStrictEqual(false)
    })

    it(`should return false if proposal made by undefined user with web3address`, () => {
        const proposal = {
            proposer: { web3address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, undefined)).toStrictEqual(false)
    })

    it(`should return true if proposal made by user without web3address`, () => {
        const proposal = {
            owner: { userId: user.id },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, user)).toStrictEqual(true)
    })

    it(`should return false if proposal made by otherUser without web3address`, () => {
        const proposal = {
            owner: { userId: user.id },
            proposer: {},
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, otherUser)).toStrictEqual(false)
    })

    it(`should return false if proposal made by undefined user without web3address`, () => {
        const proposal = {
            owner: { userId: user.id },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, undefined)).toStrictEqual(false)
    })

    it(`should return true if proposal is made by user`, () => {
        const proposal = {
            owner: { userId: user.id },
            proposer: { web3address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, user)).toStrictEqual(true)
    })

    it(`should return false if proposal is made by otherUser`, () => {
        const proposal = {
            owner: { userId: user.id },
            proposer: { web3address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, otherUser)).toStrictEqual(false)
    })

    it(`should return false if proposal is made by undefined user`, () => {
        const proposal = {
            owner: { userId: user.id },
            proposer: { web3address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, undefined)).toStrictEqual(false)
    })

    it(`should return true if proposal have user in ownerId and otherUser in proposer`, () => {
        const proposal = {
            owner: { userId: user.id },
            proposer: { web3address: otherUser.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, user)).toStrictEqual(true)
    })

    it(`should return true if proposal have in user ownerId and otherUser in proposer when user is otherUser`, () => {
        const proposal = {
            owner: { userId: user.id },
            proposer: { web3address: otherUser.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, otherUser)).toStrictEqual(true)
    })

    it(`should return false if proposal have in user ownerId and otherUser in proposer when user is undefined`, () => {
        const proposal = {
            owner: { userId: user.id },
            proposer: { web3address: otherUser.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, undefined)).toStrictEqual(false)
    })

    it(`should return true if proposal have otherUser in ownerId and user in proposer`, () => {
        const proposal = {
            owner: { userId: otherUser.id },
            proposer: { web3address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, user)).toStrictEqual(true)
    })

    it(`should return true if proposal have otherUser in ownerId and user in proposer when user is otherUser`, () => {
        const proposal = {
            owner: { userId: otherUser.id },
            proposer: { web3address: user.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, otherUser)).toStrictEqual(true)
    })

    it(`should return false if proposal have otherUser in ownerId and user in proposer when user is undefined`, () => {
        const proposal = {
            owner: { userId: otherUser.id },
            proposer: { web3address: user.web3Addresses[0].address },
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
            proposer: { web3address: otherUser.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, user)).toStrictEqual(false)
    })

    it(`should return true if proposer is made by otherUser and user is otherUser`, () => {
        const proposal = {
            proposer: { web3address: otherUser.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, otherUser)).toStrictEqual(true)
    })

    it(`should return false if proposer is made by otherUser and user is undefined`, () => {
        const proposal = {
            proposer: { web3address: otherUser.web3Addresses[0].address },
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, undefined)).toStrictEqual(false)
    })

    it(`should return false if proposal is made by otherUser without proposer and user is user`, () => {
        const proposal = {
            owner: { userId: otherUser.id },
            proposer: {},
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, user)).toStrictEqual(false)
    })

    it(`should return true if proposal is made by otherUser without proposer and user is otherUser`, () => {
        const proposal = {
            owner: { userId: otherUser.id },
            proposer: {},
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, otherUser)).toStrictEqual(true)
    })

    it(`should return false if proposal is made by otherUser without proposer and user is undefined`, () => {
        const proposal = {
            owner: { userId: otherUser.id },
            proposer: {},
        } as ProposalDto

        expect(isProposalMadeByUser(proposal, undefined)).toStrictEqual(false)
    })
})
