import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../auth/AuthContext'
import { TimeFrame, useTimeFrame } from '../../util/useTimeFrame'
import { BountyDefaultFilter, BountyFilter, BountyFilterSearchParamName, useBountiesFilter } from '../useBountiesFilter'
import Filters from '../../components/filters/Filters'

const ON_CHAIN_FILTER_VALUES = [
    BountyFilter.Proposed,
    BountyFilter.Approved,
    BountyFilter.Funded,
    BountyFilter.CuratorProposed,
    BountyFilter.Active,
    BountyFilter.PendingPayout,
]

const HISTORY_FILTER_VALUES = [BountyFilter.Claimed, BountyFilter.Rejected]

const BountyStatusFilters = () => {
    const { t } = useTranslation()
    const { isUserSignedIn } = useAuth()
    const { param: bountiesFilter, setParam: setBountyFilter } = useBountiesFilter()
    const { param: timeFrame } = useTimeFrame()
    const isOnChain = useMemo(() => timeFrame === TimeFrame.OnChain, [timeFrame])

    const filterValues = useMemo(() => {
        const filters = [BountyFilter.All]
        if (isUserSignedIn) filters.push(BountyFilter.Mine)
        return filters.concat(isOnChain ? ON_CHAIN_FILTER_VALUES : HISTORY_FILTER_VALUES)
    }, [isUserSignedIn, isOnChain])

    const getTranslation = (bountyFilter: BountyFilter): any => {
        switch (bountyFilter) {
            case BountyFilter.All:
                return t('bounty.list.filters.all')
            case BountyFilter.Mine:
                return t('bounty.list.filters.mine')
            case BountyFilter.Proposed:
                return t('bounty.list.filters.proposed')
            case BountyFilter.Approved:
                return t('bounty.list.filters.approved')
            case BountyFilter.Funded:
                return t('bounty.list.filters.funded')
            case BountyFilter.CuratorProposed:
                return t('bounty.list.filters.curatorProposed')
            case BountyFilter.Active:
                return t('bounty.list.filters.active')
            case BountyFilter.PendingPayout:
                return t('bounty.list.filters.pendingPayout')
            case BountyFilter.Claimed:
                return t('bounty.list.filters.claimed')
            case BountyFilter.Rejected:
                return t('bounty.list.filters.rejected')
        }
    }

    const getFilterOption = (filter: BountyFilter) => ({
        isDefault: filter === BountyDefaultFilter,
        label: getTranslation(filter),
        path: setBountyFilter(filter),
        filterName: filter,
    })
    const filterOptions = useMemo(() => filterValues.map((filter: BountyFilter) => getFilterOption(filter)), [
        filterValues,
        getFilterOption,
    ])

    /**
     * Current tab entry is forced, because there should be always some filter specified.
     */
    const currentFilterOption = filterOptions.find((entry) => entry.label === getTranslation(bountiesFilter))!

    return (
        <Filters
            searchParamName={BountyFilterSearchParamName}
            currentFilterOption={currentFilterOption}
            filterOptions={filterOptions}
        />
    )
}

export default BountyStatusFilters
