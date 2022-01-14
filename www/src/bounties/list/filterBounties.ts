import { BountyDto, BountyStatus } from '../bounties.dto'
import { DoesBountyBelongToUser } from '../utils/bounties.utils'
import { BountyFilter } from '../useBountiesFilter'

export function filterBounties(bounties: BountyDto[], filter: BountyFilter): BountyDto[] {
    switch (filter) {
        case BountyFilter.All:
            return bounties
        case BountyFilter.Mine:
            return bounties.filter((bounty) => DoesBountyBelongToUser(bounty))
        case BountyFilter.Proposed:
            return bounties.filter((bounty) => bounty.status === BountyStatus.Proposed)
        case BountyFilter.Approved:
            return bounties.filter((bounty) => bounty.status === BountyStatus.Approved)
        case BountyFilter.Funded:
            return bounties.filter((bounty) => bounty.status === BountyStatus.Funded)
        case BountyFilter.CuratorProposed:
            return bounties.filter((bounty) => bounty.status === BountyStatus.CuratorProposed)
        case BountyFilter.Active:
            return bounties.filter((bounty) => bounty.status === BountyStatus.Active)
        case BountyFilter.PendingPayout:
            return bounties.filter((bounty) => bounty.status === BountyStatus.PendingPayout)
        case BountyFilter.Claimed:
            return bounties.filter((bounty) => bounty.status === BountyStatus.Claimed)
        case BountyFilter.Rejected:
            return bounties.filter((bounty) => bounty.status === BountyStatus.Rejected)
    }
}
