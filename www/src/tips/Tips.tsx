import { useGetTips } from './tips.api'
import { useTimeFrame } from '../util/useTimeFrame'
import { useNetworks } from '../networks/useNetworks'
import { defaultPaginatedRequestParams } from '../util/pagination/pagination.request.params'
import React, { useMemo } from 'react'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import LoadMore from '../components/loadMore/LoadMore'
import TipsHeader from './TipsHeader'
import TipCard from './list/TipCard'
import Grid from '../components/grid/Grid'
import { TipFilter, useTipFilter } from './list/useTipFilter'
import { TipStatus } from './tips.dto'
import { useAuth } from '../auth/AuthContext'

const getTipStatus = (filter: TipFilter) => {
    switch (filter) {
        case TipFilter.Proposed:
            return TipStatus.Proposed
        case TipFilter.Tipped:
            return TipStatus.Tipped
        case TipFilter.Closing:
            return TipStatus.Closing
        case TipFilter.PendingPayout:
            return TipStatus.PendingPayout
        default:
            return null
    }
}

const Tips = () => {
    const { t } = useTranslation()
    const { user } = useAuth()
    const { param: tipFilter } = useTipFilter()
    const { param: timeFrame } = useTimeFrame()
    const { network } = useNetworks()
    const { status, data, isLoading, fetchNextPage } = useGetTips({
        network: network.id,
        ownerId: tipFilter === TipFilter.All ? user?.id : null,
        status: getTipStatus(tipFilter),
        timeFrame,
        ...defaultPaginatedRequestParams(),
    })
    const tips = useMemo(() => data?.pages?.map((page) => page.items).flat() ?? [], [data])
    const canLoadMore = useMemo(() => (data?.pages ? data?.pages[0]?.total > tips.length : false), [data])
    return (
        <>
            <TipsHeader />
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingTips')}
                loadingText={t('loading.tips')}
            >
                <Grid items={tips} renderItem={(item) => <TipCard item={item} />} />
            </LoadingWrapper>
            {canLoadMore ? <LoadMore disabled={isLoading} onClick={fetchNextPage} /> : null}
        </>
    )
}

export default Tips
