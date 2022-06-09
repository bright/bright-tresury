import { ChildBountyDto, ChildBountyStatus } from './child-bounties.dto'
import { useAuth } from '../../../auth/AuthContext'
import { BountyDto } from '../../bounties.dto'
import { useBounty } from '../useBounty'
import { useBestNumber } from '../../../util/useBestNumber'
import BN from 'bn.js'

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
    canProposeCurator: boolean
    canAcceptCurator: boolean
    canUnassignCuratorByBountyCurator: boolean
    canUsassignCuratorByChildBountyCurator: boolean
    canUnassignCuratorByCommunity: boolean
    canUnassignCurator: boolean
    canClaimPayout: boolean
    hasDetails: boolean
}
// Those condition are defined based on the child_bounties pallet defined here:
// https://github.com/paritytech/substrate/blob/master/frame/child-bounties/src/lib.rs
export const useChildBounty = (bounty: BountyDto, childBounty: ChildBountyDto): UseChildBountyResult => {
    const { bestNumber } = useBestNumber()
    const { isActive: isBountyActive, isCurator: isBountyCurator, isUpdateDueExpired } = useBounty(bounty)
    const { hasWeb3AddressAssigned, user } = useAuth()
    const isSignedInWithWeb3 = user?.isWeb3
    const isActive = childBounty.status === ChildBountyStatus.Active
    const isAdded = childBounty.status === ChildBountyStatus.Added
    const isCuratorProposed = childBounty.status === ChildBountyStatus.CuratorProposed
    const isPendingPayout = childBounty.status === ChildBountyStatus.PendingPayout

    const canProposeCurator = isBountyActive && isBountyCurator && isAdded

    const hasCurator = isActive || isPendingPayout || isCuratorProposed
    const isCurator = hasCurator && hasWeb3AddressAssigned(childBounty.curator?.web3address)

    const canAcceptCurator = isBountyActive && isCuratorProposed && isCurator

    const hasBeneficiary = isPendingPayout
    const isBeneficiary = isPendingPayout && hasWeb3AddressAssigned(childBounty.beneficiary?.web3address)

    const canUnassignCuratorByBountyCurator =
        isBountyActive && isBountyCurator && (isCuratorProposed || isActive || isPendingPayout)
    const canUsassignCuratorByChildBountyCurator = isCurator && (isCuratorProposed || isActive)
    const canUnassignCuratorByCommunity = !!(isSignedInWithWeb3 && isActive && isBountyActive && isUpdateDueExpired)

    const canUnassignCurator =
        canUnassignCuratorByBountyCurator || canUsassignCuratorByChildBountyCurator || canUnassignCuratorByCommunity

    const canClaimPayout = !!(
        (isBountyCurator || isCurator || isBeneficiary) &&
        isPendingPayout &&
        bestNumber &&
        childBounty.unlockAt &&
        bestNumber.cmp(new BN(childBounty.unlockAt)) >= 0
    )

    const hasDetails = !!childBounty?.owner
    const isOwner = !!childBounty && !!user?.id && user?.id === childBounty.owner?.userId

    const canEdit = isOwner || isCurator

    return {
        hasBeneficiary,
        isBeneficiary,
        canEdit,
        hasCurator,
        isCurator,
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
    }
}
