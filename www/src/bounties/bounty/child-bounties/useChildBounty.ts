import { ChildBountyDto, ChildBountyStatus } from './child-bounties.dto'
import { BountyDto } from '../../bounties.dto'
import { useAuth } from '../../../auth/AuthContext'
import { useBounty } from '../useBounty'

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

export const useChildBounty = (bounty: BountyDto, childBounty: ChildBountyDto): UseChildBountyResult => {
    const { isActive: isBountyActive, isCurator: isBountyCurator } = useBounty(bounty)
    const { hasWeb3AddressAssigned, user } = useAuth()
    const isSignedInWithWeb3 = user?.isWeb3

    const isAdded = childBounty.status === ChildBountyStatus.Added
    const isCuratorProposed = childBounty.status === ChildBountyStatus.CuratorProposed
    const isActive = childBounty.status === ChildBountyStatus.Active
    const isPendingPayout = childBounty.status === ChildBountyStatus.PendingPayout

    const canProposeCurator = isBountyActive && isBountyCurator && isAdded

    const isCurator = hasWeb3AddressAssigned(childBounty.curator?.web3address)

    const canAcceptCurator = isBountyActive && isCuratorProposed && isCurator

    const isUpdateDueExpired = false
    const canUnassignCurator =
        (isCuratorProposed && isCurator) ||
        (isCuratorProposed && isBountyActive && isBountyCurator) ||
        (isActive && isCurator) ||
        (isActive && isBountyCurator) ||
        (isActive && isUpdateDueExpired && isSignedInWithWeb3)
    const canClaimPayout = false

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
