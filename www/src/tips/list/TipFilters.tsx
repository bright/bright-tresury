import { TabEntry } from '../../components/tabs/Tabs'
import React, { useMemo } from 'react'
import { TipDefaultFilter, TipFilter, TipFilterSearchParamName, useTipFilter } from './useTipFilter'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../auth/AuthContext'
import { TimeFrame, useTimeFrame } from '../../util/useTimeFrame'
import Filters from '../../components/filters/Filters'

const ON_CHAIN_FILTER_VALUES = [TipFilter.Proposed, TipFilter.Tipped, TipFilter.Closing, TipFilter.PendingPayout]

const HISTORY_FILTER_VALUES: TipFilter[] = []

const TipFilters = () => {
    const { t } = useTranslation()
    const { isUserSignedIn } = useAuth()
    const { param: tipFilter, setParam: setTipFilter } = useTipFilter()
    const { param: timeFrame } = useTimeFrame()
    const isOnChain = useMemo(() => timeFrame === TimeFrame.OnChain, [timeFrame])

    const filterValues = useMemo(() => {
        const filters = [TipFilter.All]
        if (isUserSignedIn) filters.push(TipFilter.Mine)
        return filters.concat(isOnChain ? ON_CHAIN_FILTER_VALUES : HISTORY_FILTER_VALUES)
    }, [isUserSignedIn, isOnChain])

    const getTranslation = (tipFilter: TipFilter) => {
        switch (tipFilter) {
            case TipFilter.All:
                return t('tip.list.filters.all')
            case TipFilter.Mine:
                return t('tip.list.filters.mine')
            case TipFilter.Proposed:
                return t('tip.list.filters.proposed')
            case TipFilter.Tipped:
                return t('tip.list.filters.tipped')
            case TipFilter.Closing:
                return t('tip.list.filters.closing')
            case TipFilter.PendingPayout:
                return t('tip.list.filters.pendingPayout')
        }
    }

    const filterOptions: TabEntry[] = useMemo(
        () =>
            filterValues.map((filter: TipFilter) => ({
                isDefault: filter === TipDefaultFilter,
                label: getTranslation(filter),
                path: setTipFilter(filter),
                filterName: filter,
            })),
        [],
    )

    const currentFilterOption = filterOptions.find((entry) => entry.label === getTranslation(tipFilter))!

    return (
        <Filters
            searchParamName={TipFilterSearchParamName}
            currentFilterOption={currentFilterOption}
            filterOptions={filterOptions}
        />
    )
}

export default TipFilters
