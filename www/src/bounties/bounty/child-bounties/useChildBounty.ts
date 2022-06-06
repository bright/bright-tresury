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
    canUnassignCuratorByBountyCurator: boolean
    canUsassignCuratorByChildBountyCurator: boolean
    canUnassignCuratorByCommunity: boolean
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

    const hasCurator = isActive || isPendingPayout || isCuratorProposed

    const canUnassignCuratorByBountyCurator =
        isBountyActive && isBountyCurator && (isCuratorProposed || isActive || isPendingPayout)
    const canUsassignCuratorByChildBountyCurator = isCurator && (isCuratorProposed || isActive)
    const canUnassignCuratorByCommunity = !!(isSignedInWithWeb3 && isActive && isBountyActive && isUpdateDueExpired)

    const canUnassignCurator =
        canUnassignCuratorByBountyCurator || canUsassignCuratorByChildBountyCurator || canUnassignCuratorByCommunity

    const canClaimPayout = !!(
        isPendingPayout &&
        bestNumber &&
        childBounty.unlockAt &&
        bestNumber.cmp(new BN(childBounty.unlockAt)) >= 0
    )

    return {
        hasCurator,
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
    }
}
