import { ChildBountyDto, ChildBountyStatus } from './child-bounties.dto'
import { useAuth } from '../../../auth/AuthContext'
import { BountyDto } from '../../bounties.dto'
import { useBounty } from '../useBounty'
import { useBestNumber } from '../../../util/useBestNumber'
import BN from 'bn.js'
import { Nil } from '../../../util/types'

export interface UseChildBountyResult {
    isAdded: boolean
    isCuratorProposed: boolean
    isActive: boolean
    isPendingPayout: boolean

    hasBeneficiary: boolean
    isBeneficiary: boolean

    canEdit: boolean
    hasCurator: boolean
    isCurator: boolean
    curator: Nil<string>
    isProposer: boolean
    proposer: Nil<string>
    canProposeCurator: boolean
    canAcceptCurator: boolean
    canUnassignCuratorByBountyCurator: boolean
    canUsassignCuratorByChildBountyCurator: boolean
    canUnassignCuratorByCommunity: boolean
    canUnassignCurator: boolean
    canClaimPayout: boolean
    hasDetails: boolean
    canCloseChildBounty: boolean
    canAward: boolean

    canSharePolkassembly: boolean
}
// Those condition are defined based on the child_bounties pallet defined here:
// https://github.com/paritytech/substrate/blob/master/frame/child-bounties/src/lib.rs
export const useChildBounty = (bounty: BountyDto, childBounty: ChildBountyDto): UseChildBountyResult => {
    const { bestNumber } = useBestNumber()
    const { isActive: isBountyActive, isCurator: isProposer, isUpdateDueExpired, curator: bountyCurator } = useBounty(
        bounty,
    )
    const { hasWeb3AddressAssigned, user } = useAuth()
    const isSignedInWithWeb3 = user?.isWeb3
    const isActive = childBounty.status === ChildBountyStatus.Active
    const isAdded = childBounty.status === ChildBountyStatus.Added
    const isCuratorProposed = childBounty.status === ChildBountyStatus.CuratorProposed
    const isPendingPayout = childBounty.status === ChildBountyStatus.PendingPayout
    const isClaimed = childBounty.status === ChildBountyStatus.Claimed
    const isCanceled = childBounty.status === ChildBountyStatus.Canceled
    const isAwarded = childBounty.status === ChildBountyStatus.Awarded

    const canProposeCurator = isBountyActive && isProposer && isAdded

    const hasCurator = isActive || isPendingPayout || isCuratorProposed || isClaimed || isCanceled || isAwarded
    const isCurator = hasCurator && hasWeb3AddressAssigned(childBounty.curator?.web3address)
    const curator = childBounty.curator?.web3address
    const canAcceptCurator = isBountyActive && isCuratorProposed && isCurator

    const hasBeneficiary = isPendingPayout
    const isBeneficiary = isPendingPayout && hasWeb3AddressAssigned(childBounty.beneficiary?.web3address)

    const canUnassignCuratorByBountyCurator =
        isBountyActive && isProposer && (isCuratorProposed || isActive || isPendingPayout)
    const canUsassignCuratorByChildBountyCurator = isCurator && (isCuratorProposed || isActive)
    const canUnassignCuratorByCommunity = !!(isSignedInWithWeb3 && isActive && isBountyActive && isUpdateDueExpired)

    const canUnassignCurator =
        canUnassignCuratorByBountyCurator || canUsassignCuratorByChildBountyCurator || canUnassignCuratorByCommunity

    const canClaimPayout = !!(
        (isProposer || isCurator || isBeneficiary) &&
        isPendingPayout &&
        bestNumber &&
        childBounty.unlockAt &&
        bestNumber.cmp(new BN(childBounty.unlockAt)) >= 0
    )

    const hasDetails = !!childBounty?.owner
    const isOwner = !!childBounty && !!user?.id && user?.id === childBounty.owner?.userId
    const canEdit = isOwner || isCurator || isProposer
    const canSharePolkassembly = canEdit
    const canCloseChildBounty = isProposer && isBountyActive && !isPendingPayout

    const canAward = (isProposer || isCurator) && isBountyActive && isActive

    return {
        hasBeneficiary,
        isBeneficiary,
        canEdit,
        hasCurator,
        isCurator,
        curator,
        isProposer,
        proposer: bountyCurator,
        canProposeCurator,
        canAcceptCurator,
        canUnassignCuratorByBountyCurator,
        canUsassignCuratorByChildBountyCurator,
        canUnassignCuratorByCommunity,
        canUnassignCurator,
        isAdded,
        isCuratorProposed,
        isActive,
        isPendingPayout,
        canClaimPayout,
        hasDetails,
        canCloseChildBounty,
        canAward,
        canSharePolkassembly,
    }
}
