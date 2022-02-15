import { useParamFromQuery } from '../util/useParamFromQuery'

export enum BountyFilter {
    All = 'all',
    Mine = 'mine',
    Proposed = 'proposed',
    Approved = 'approved',
    Funded = 'funded',
    CuratorProposed = 'curator-proposed',
    Active = 'active',
    PendingPayout = 'pending-payout',
    Claimed = 'claimed',
    Rejected = 'rejected',
}

export const BountyFilterSearchParamName = 'filter'
export const BountyDefaultFilter = BountyFilter.All

export const useBountiesFilter = () =>
    useParamFromQuery({
        enumObject: BountyFilter,
        paramName: BountyFilterSearchParamName,
        defaultValue: BountyDefaultFilter,
        preserveParam: true,
    })
