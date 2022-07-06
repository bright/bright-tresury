import { useAuth } from '../../auth/AuthContext'
import { Nil } from '../../util/types'
import { BountyDto, BountyStatus } from '../bounties.dto'
import { useTimeLeft } from '../../util/useTimeLeft'
import { useBestNumber } from '../../util/useBestNumber'
import BN from 'bn.js'

export interface UseBountyResult {
    canEdit: boolean
    canAccept: boolean
    canReject: boolean
    canAward: boolean
    canClaimPayout: boolean
    isUpdateDueExpired: boolean
    canExtendExpiry: boolean
    isProposedCurator: boolean
    isCurator: boolean
    curator: Nil<string>
    isOwner: boolean
    isProposer: boolean
    isBeneficiary: boolean
    hasDetails: boolean
    isCuratorProposed: boolean
    isActive: boolean
    isPendingPayout: boolean
    isClaimed: boolean
    hasChildBounties: boolean
}

export const useBounty = (bounty: Nil<BountyDto>): UseBountyResult => {
    const { user, hasWeb3AddressAssigned } = useAuth()
    const { bestNumber } = useBestNumber()
    const isProposed = bounty?.status === BountyStatus.Proposed
    const isApproved = bounty?.status === BountyStatus.Approved
    const isFunded = bounty?.status === BountyStatus.Funded
    const isCuratorProposed = bounty?.status === BountyStatus.CuratorProposed
    const isActive = bounty?.status === BountyStatus.Active
    const isPendingPayout = bounty?.status === BountyStatus.PendingPayout
    const isClaimed = bounty?.status === BountyStatus.Claimed
    const isUnknown = bounty?.status === BountyStatus.Unknown

    const isProposedCurator = isCuratorProposed && hasWeb3AddressAssigned(bounty.curator.web3address)
    const isCurator = (isActive || isPendingPayout) && hasWeb3AddressAssigned(bounty.curator.web3address)
    const curator = isActive || isPendingPayout ? bounty.curator.web3address : null
    const isOwner = !!bounty && !!user?.id && user?.id === bounty.owner?.userId

    const isProposer = !!bounty && hasWeb3AddressAssigned(bounty.proposer.web3address)
    const isBeneficiary = !!bounty && isPendingPayout && hasWeb3AddressAssigned(bounty.beneficiary.web3address)

    const canReject = (isCurator && isActive) || isProposedCurator

    const canAccept = isProposedCurator

    const canAward = isCurator && isActive

    const canEdit = isOwner || isProposer || isCurator

    const canClaimPayout = isBeneficiary && isPendingPayout && !bounty.unlockAt

    const canExtendExpiry = isCurator && isActive

    const isUpdateDueExpired = !!(
        isActive &&
        bounty?.updateDue &&
        bestNumber &&
        bestNumber.cmp(new BN(bounty.updateDue)) >= 0
    )

    const hasDetails = !!bounty?.owner
    const hasChildBounties = !!bounty?.childBountiesCount
    return {
        canReject,
        canAccept,
        canEdit,
        canAward,
        canClaimPayout,
        isUpdateDueExpired,
        canExtendExpiry,
        isProposedCurator,
        isCurator,
        curator,
        isOwner,
        isProposer,
        isBeneficiary,
        hasDetails,
        isCuratorProposed,
        isActive,
        isPendingPayout,
        isClaimed,
        hasChildBounties,
    }
}
