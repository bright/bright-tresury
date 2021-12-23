import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useMemo, useState } from 'react'
import BountiesHeader from './BountiesHeader'
import { useLocation } from 'react-router-dom'
import { BountyDefaultFilter, BountyFilter, BountyFilterSearchParamName } from './list/BountyStatusFilters'
import { TimeFrame } from '../components/select/TimeSelect'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { useGetBounties } from './bounties.api'
import { useNetworks } from '../networks/useNetworks'
import { filterBounties } from './list/filterBounties'
import BountiesList from './list/BountiesList'
import LoadMore from '../components/loadMore/LoadMore'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
        },
    }),
)

const Bounties = () => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { search } = useLocation()
    const { network } = useNetworks()

    const [timeFrame, setTimeFrame] = useState(TimeFrame.OnChain)

    const onTimeFrameChange = (newTimeFrame: TimeFrame) => {
        remove()
        setTimeFrame(newTimeFrame)
    }
    const PAGE_SIZE = 10
    const { status, data, remove, isLoading, fetchNextPage } = useGetBounties(network.id, timeFrame, PAGE_SIZE)

    const bounties = data?.pages?.map(page => page.items).flat() ?? []

    const pageNumber = data?.pages?.length ?? 0
    const canLoadMore = pageNumber * PAGE_SIZE === bounties.length

    const selectedFilter = useMemo(() => {
        const filterParam = new URLSearchParams(search).get(BountyFilterSearchParamName)
        return filterParam ? (filterParam as BountyFilter) : BountyDefaultFilter
    }, [search])

    const filteredBounties = useMemo(() => {
        return bounties ? filterBounties(bounties, selectedFilter) : []
    }, [selectedFilter, bounties])
    const isCurrentSpendPeriod = timeFrame === TimeFrame.OnChain
    return (
        <div className={classes.root}>
            <BountiesHeader
                selectedFilter={selectedFilter}
                selectedTimeFrame={timeFrame}
                onTimeFrameChange={onTimeFrameChange}
            />
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingBounties')}
                loadingText={t('loading.bounties')}
            >
                <BountiesList bounties={isCurrentSpendPeriod ? filteredBounties : bounties} />
            </LoadingWrapper>

            {canLoadMore ? <LoadMore disabled={isLoading} onClick={fetchNextPage} /> : null}
        </div>
    )
}

export default Bounties
