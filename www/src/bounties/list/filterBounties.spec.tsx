import * as AuthContext from '../../auth/AuthContext'
import { BountyDto, BountyStatus } from '../bounties.dto'
import { filterBounties } from './filterBounties'
import { renderHook } from '@testing-library/react-hooks'
import * as React from 'react'
import { compareWeb3Address } from '../../util/web3address.util'
import { BountyFilter } from '../useBountiesFilter'

const createBounty = (status: BountyStatus, user: AuthContext.AuthContextUser): BountyDto => {
    return {
        ownerId: user.id,
        status: status,
        proposer: { address: '' },
        beneficiary: { address: '' },
        curator: { address: '' },
    } as BountyDto
}

describe('filter bounties', () => {
    let user: AuthContext.AuthContextUser
    let otherUser: AuthContext.AuthContextUser
    let bounties: BountyDto[]

    beforeAll(() => {
        user = {
            id: 'df03924f-a9d5-4920-bd40-a56ebfd1ae22',
        } as AuthContext.AuthContextUser

        otherUser = {
            id: 'f847a9de-e640-460a-bd1f-0eaeb4f6da5b',
        } as AuthContext.AuthContextUser

        bounties = [
            createBounty(BountyStatus.Proposed, user),
            createBounty(BountyStatus.Approved, user),
            createBounty(BountyStatus.Funded, user),
            createBounty(BountyStatus.CuratorProposed, user),
            createBounty(BountyStatus.Active, user),
            createBounty(BountyStatus.PendingPayout, user),
        ] as BountyDto[]
    })

    describe(`filter by ${BountyFilter.All}`, () => {
        it('should return all bounties', () => {
            expect(filterBounties(bounties, BountyFilter.All)).toStrictEqual([
                bounties[0],
                bounties[1],
                bounties[2],
                bounties[3],
                bounties[4],
                bounties[5],
            ])
        })
    })

    describe(`filter by ${BountyFilter.Mine}`, () => {
        it(`should return bounties owned by the given user`, () => {
            expect(filterBounties(bounties, BountyFilter.All)).toStrictEqual([
                bounties[0],
                bounties[1],
                bounties[2],
                bounties[3],
                bounties[4],
                bounties[5],
            ])
        })

        it('should not return bounties owned by other users', () => {
            const otherUserBounties = [
                createBounty(BountyStatus.Proposed, otherUser),
                createBounty(BountyStatus.Approved, otherUser),
                createBounty(BountyStatus.Funded, otherUser),
                createBounty(BountyStatus.CuratorProposed, otherUser),
                createBounty(BountyStatus.Active, otherUser),
                createBounty(BountyStatus.PendingPayout, otherUser),
            ]

            jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
                user: user,
                hasWeb3AddressAssigned: (address: string) =>
                    !!user?.web3Addresses?.find((web3Address) => compareWeb3Address(web3Address.address, address)),
            } as AuthContext.AuthContextState)

            const { result } = renderHook(() => filterBounties(otherUserBounties, BountyFilter.Mine))

            expect(result.current).toStrictEqual([])
        })
    })

    describe(`filter by ${BountyFilter.Proposed}`, () => {
        it(`should return bounties with ${BountyStatus.Proposed} status only`, () => {
            expect(filterBounties(bounties, BountyFilter.Proposed)).toStrictEqual([bounties[0]])
        })
    })

    describe(`filter by ${BountyFilter.Approved}`, () => {
        it(`should return bounties with ${BountyStatus.Approved} status only`, () => {
            expect(filterBounties(bounties, BountyFilter.Approved)).toStrictEqual([bounties[1]])
        })
    })
    describe(`filter by ${BountyFilter.Funded}`, () => {
        it(`should return bounties with ${BountyStatus.Funded} status only`, () => {
            expect(filterBounties(bounties, BountyFilter.Funded)).toStrictEqual([bounties[2]])
        })
    })
    describe(`filter by ${BountyFilter.CuratorProposed}`, () => {
        it(`should return bounties with ${BountyStatus.CuratorProposed} status only`, () => {
            expect(filterBounties(bounties, BountyFilter.CuratorProposed)).toStrictEqual([bounties[3]])
        })
    })
    describe(`filter by ${BountyFilter.Active}`, () => {
        it(`should return bounties with ${BountyStatus.Active} status only`, () => {
            expect(filterBounties(bounties, BountyFilter.Active)).toStrictEqual([bounties[4]])
        })
    })
    describe(`filter by ${BountyFilter.PendingPayout}`, () => {
        it(`should return bounties with ${BountyStatus.PendingPayout} status only`, () => {
            expect(filterBounties(bounties, BountyFilter.PendingPayout)).toStrictEqual([bounties[5]])
        })
    })
})
