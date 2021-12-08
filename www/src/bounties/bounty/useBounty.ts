import { useAuth } from '../../auth/AuthContext'
import { Nil } from '../../util/types'
import { BountyDto, BountyStatus } from '../bounties.dto'

export interface UseBountyResult {
    canEdit: boolean
    canAccept: boolean
    canReject: boolean
    canAward: boolean
    canClaimPayout: boolean
    canExtendExpiry: boolean
    isCurator: boolean
    isOwner: boolean
    isProposer: boolean
    isBeneficiary: boolean
    hasDetails: boolean
}

export const useBounty = (bounty: Nil<BountyDto>): UseBountyResult => {
    const { user, hasWeb3AddressAssigned } = useAuth()
    const isProposed = bounty?.status === BountyStatus.Proposed
    const isApproved = bounty?.status === BountyStatus.Approved
    const isFunded = bounty?.status === BountyStatus.Funded
    const isCuratorProposed = bounty?.status === BountyStatus.CuratorProposed
    const isActive = bounty?.status === BountyStatus.Active
    const isPendingPayout = bounty?.status === BountyStatus.PendingPayout

    const hasCurator = !!bounty && (isCuratorProposed || isActive || isPendingPayout)

    const isCurator = hasCurator && hasWeb3AddressAssigned(bounty.curator.address)

    const isOwner = !!bounty && !!user?.id && user?.id === bounty.ownerId

    const isProposer = !!bounty && hasWeb3AddressAssigned(bounty.proposer.address)
    const isBeneficiary = !!bounty && isPendingPayout && hasWeb3AddressAssigned(bounty.beneficiary.address)

    const canReject = isCurator && (isCuratorProposed || isActive)

    const canAccept = isCurator && isCuratorProposed

    const canAward = isCurator && isActive

    const canEdit =
        (isOwner || isProposer || isCurator) && (isProposed || isApproved || isFunded || isCuratorProposed || isActive)

    const canClaimPayout = isBeneficiary && isPendingPayout && !bounty.unlockAt

    const canExtendExpiry = isCurator && isActive

    const hasDetails = !!bounty?.ownerId

    return {
        canReject,
        canAccept,
        canEdit,
        canAward,
        canClaimPayout,
        canExtendExpiry,
        isCurator,
        isOwner,
        isProposer,
        isBeneficiary,
        hasDetails,
    }
}
