import { useAuth } from '../../auth/AuthContext'
import { Nil } from '../../util/types'
import { BountyDto, BountyStatus } from '../bounties.dto'

export interface UseBountyResult {
    isCurator: boolean
    canAccept: boolean
    canReject: boolean
}

export const useBounty = (bounty: Nil<BountyDto>): UseBountyResult => {
    const { user } = useAuth()
    const hasCurator =
        !!bounty &&
        (bounty.status === BountyStatus.CuratorProposed ||
            bounty.status === BountyStatus.Active ||
            bounty.status === BountyStatus.PendingPayout)
    const isCurator =
        hasCurator && !!user?.web3Addresses.find((web3Address) => web3Address.address === bounty.curator.address)
    const canReject =
        isCurator && (bounty.status === BountyStatus.CuratorProposed || bounty.status === BountyStatus.Active)
    const canAccept = isCurator && bounty.status === BountyStatus.CuratorProposed
    return {
        isCurator,
        canReject,
        canAccept,
    }
}
