import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import BountiesHeader from './BountiesHeader'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { useGetBounties } from './bounties.api'
import { useNetworks } from '../networks/useNetworks'
import { filterBounties } from './list/filterBounties'
import BountiesList from './list/BountiesList'
import LoadMore from '../components/loadMore/LoadMore'
import { useTimeFrame } from '../util/useTimeFrame'
import { useBountiesFilter } from './useBountiesFilter'

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
    const { network } = useNetworks()
    const { param: bountiesFilter } = useBountiesFilter()
    const { param: timeFrame } = useTimeFrame()
    const PAGE_SIZE = 10
    const { status, data, isLoading, fetchNextPage } = useGetBounties(network.id, timeFrame, PAGE_SIZE)

    const bounties = data?.pages?.map(page => page.items).flat() ?? []

    const pageNumber = data?.pages?.length ?? 0
    const canLoadMore = pageNumber * PAGE_SIZE === bounties.length

    const filteredBounties = useMemo(() => {
        return bounties ? filterBounties(bounties, bountiesFilter) : []
    }, [bountiesFilter, bounties])

    return (
        <div className={classes.root}>
            <BountiesHeader />
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingBounties')}
                loadingText={t('loading.bounties')}
            >
                <BountiesList bounties={filteredBounties} />
            </LoadingWrapper>

            {canLoadMore ? <LoadMore disabled={isLoading} onClick={fetchNextPage} /> : null}
        </div>
    )
}

export default Bounties
