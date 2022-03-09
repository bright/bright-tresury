import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import BountiesHeader from './BountiesHeader'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { useGetBounties } from './bounties.api'
import { useNetworks } from '../networks/useNetworks'
import BountiesList from './list/BountiesList'
import LoadMore from '../components/loadMore/LoadMore'
import { useTimeFrame } from '../util/useTimeFrame'
import { BountyFilter, useBountiesFilter } from './useBountiesFilter'
import { useAuth } from '../auth/AuthContext'
import { BountyStatus } from './bounties.dto'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
        },
    }),
)

const getBountyStatus = (filter: BountyFilter) => {
    switch (filter) {
        case BountyFilter.Active:
            return BountyStatus.Active
        case BountyFilter.Proposed:
            return BountyStatus.Proposed
        case BountyFilter.Approved:
            return BountyStatus.Approved
        case BountyFilter.Funded:
            return BountyStatus.Funded
        case BountyFilter.CuratorProposed:
            return BountyStatus.CuratorProposed
        case BountyFilter.PendingPayout:
            return BountyStatus.PendingPayout
        case BountyFilter.Claimed:
            return BountyStatus.Claimed
        case BountyFilter.Rejected:
            return BountyStatus.Rejected
        default:
            return null
    }
}

const Bounties = () => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { network } = useNetworks()
    const { user } = useAuth()
    const { param: bountiesFilter } = useBountiesFilter()
    const { param: timeFrame } = useTimeFrame()
    const PAGE_SIZE = 10
    const { status, data, isLoading, fetchNextPage } = useGetBounties({
        network: network.id,
        ownerId: bountiesFilter === BountyFilter.Mine ? user?.id : null,
        status: getBountyStatus(bountiesFilter),
        timeFrame,
        pageNumber: 1,
        pageSize: PAGE_SIZE,
    })
    const bounties = useMemo(() => data?.pages?.map((page) => page.items).flat() ?? [], [data])
    const pageNumber = useMemo(() => data?.pages?.length ?? 0, [data])
    const canLoadMore = useMemo(() => pageNumber * PAGE_SIZE === bounties.length, [pageNumber, bounties])

    return (
        <div className={classes.root}>
            <BountiesHeader />
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingBounties')}
                loadingText={t('loading.bounties')}
            >
                <BountiesList bounties={bounties} />
            </LoadingWrapper>

            {canLoadMore ? <LoadMore disabled={isLoading} onClick={fetchNextPage} /> : null}
        </div>
    )
}

export default Bounties
