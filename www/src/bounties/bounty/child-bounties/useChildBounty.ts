import { ChildBountyDto, ChildBountyStatus } from './child-bounties.dto'
import { BountyDto } from '../../bounties.dto'
import { useAuth } from '../../../auth/AuthContext'
import { useBounty } from '../useBounty'
import { useBestNumber } from '../../../util/useBestNumber'
import BN from 'bn.js'

export interface UseChildBountyResult {
    isAdded: boolean
    isCuratorProposed: boolean
    isActive: boolean
    isPendingPayout: boolean

    hasCurator: boolean
    canProposeCurator: boolean
    canAcceptCurator: boolean
    canUnassignCurator: boolean
    canClaimPayout: boolean
}
// Those condition are defined based on the child_bounties pallet defined here:
// https://github.com/paritytech/substrate/blob/master/frame/child-bounties/src/lib.rs
export const useChildBounty = (bounty: BountyDto, childBounty: ChildBountyDto): UseChildBountyResult => {
    const { bestNumber } = useBestNumber()
    const { isActive: isBountyActive, isCurator: isBountyCurator, isUpdateDueExpired } = useBounty(bounty)
    const { hasWeb3AddressAssigned, user } = useAuth()
    const isSignedInWithWeb3 = user?.isWeb3

    const isAdded = childBounty.status === ChildBountyStatus.Added
    const isCuratorProposed = childBounty.status === ChildBountyStatus.CuratorProposed
    const isActive = childBounty.status === ChildBountyStatus.Active
    const isPendingPayout = childBounty.status === ChildBountyStatus.PendingPayout

    const canProposeCurator = isBountyActive && isBountyCurator && isAdded

    const isCurator = hasWeb3AddressAssigned(childBounty.curator?.web3address)

    const canAcceptCurator = isBountyActive && isCuratorProposed && isCurator

    const canUnassignCurator =
        (isCuratorProposed && isCurator) ||
        (isCuratorProposed && isBountyActive && isBountyCurator) ||
        (isActive && isCurator) ||
        (isActive && isBountyActive && isBountyCurator) ||
        (isSignedInWithWeb3 && isActive && isBountyActive && isUpdateDueExpired) ||
        (isPendingPayout && isBountyActive && isBountyCurator)

    const canClaimPayout = !!(
        isPendingPayout &&
        bestNumber &&
        childBounty.unlockAt &&
        bestNumber.cmp(new BN(childBounty.unlockAt)) >= 0
    )

    const hasCurator = isActive || isPendingPayout || isCuratorProposed

    return {
        hasCurator,
        canProposeCurator,
        canAcceptCurator,
        canUnassignCurator,
        isAdded,
        isCuratorProposed,
        isActive,
        isPendingPayout,
        canClaimPayout,
    }
}
