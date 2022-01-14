import { useMemo } from 'react'
import useLocationFactory from '../util/useLocationFactory'

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

export default () => {
    const { search, getSearchParam } = useLocationFactory()
    const bountiesFilter = useMemo(() => {
        const filterParam = getSearchParam(BountyFilterSearchParamName) ?? BountyDefaultFilter
        return filterParam as BountyFilter
    }, [search])
    return { bountiesFilter }
}
