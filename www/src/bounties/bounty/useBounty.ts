import { useAuth } from '../../auth/AuthContext'
import { Nil } from '../../util/types'
import { BountyDto, BountyStatus } from '../bounties.dto'

export interface UseBountyResult {
    canEdit: boolean
    canAccept: boolean
    canReject: boolean
    isCurator: boolean
    isOwner: boolean
    isProposer: boolean
    isBeneficiary: boolean
}

export const useBounty = (bounty: Nil<BountyDto>): UseBountyResult => {
    const { user } = useAuth()
    const isProposed = bounty?.status === BountyStatus.Proposed
    const isApproved = bounty?.status === BountyStatus.Approved
    const isFunded = bounty?.status === BountyStatus.Funded
    const isCuratorProposed = bounty?.status === BountyStatus.CuratorProposed
    const isActive = bounty?.status === BountyStatus.Active
    const isPendingPayout = bounty?.status === BountyStatus.PendingPayout

    const hasCurator = !!bounty && (isCuratorProposed || isActive || isPendingPayout)

    const isCurator =
        hasCurator && !!user?.web3Addresses.find((web3Address) => web3Address.address === bounty.curator.address)
    const isOwner = !!bounty && !!user?.id && user?.id === bounty.ownerId
    const isProposer =
        !!bounty && !!user?.web3Addresses.find((web3Address) => web3Address.address === bounty.proposer.address)
    const isBeneficiary =
        !!bounty && !!user?.web3Addresses.find((web3Address) => web3Address.address === bounty.beneficiary.address)

    const canReject = isCurator && (isCuratorProposed || isActive)

    const canAccept = isCurator && isCuratorProposed

    const canEdit =
        (isOwner || isProposer || isCurator) && (isProposed || isApproved || isFunded || isCuratorProposed || isActive)

    return {
        canReject,
        canAccept,
        canEdit,
        isCurator,
        isOwner,
        isProposer,
        isBeneficiary,
    }
}
