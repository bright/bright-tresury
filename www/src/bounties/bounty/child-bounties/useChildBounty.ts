import { Nil } from '../../../util/types'
import { ChildBountyDto, ChildBountyStatus } from './child-bounties.dto'

export interface UseChildBountyResult {
    hasCurator: boolean
}

export const useChildBounty = (childBounty: Nil<ChildBountyDto>): UseChildBountyResult => {
    const hasCurator =
        childBounty!.status === ChildBountyStatus.Active ||
        childBounty!.status === ChildBountyStatus.PendingPayout ||
        childBounty!.status === ChildBountyStatus.CuratorProposed

    return {
        hasCurator,
    }
}
