import { useGetTips } from './tips.api'
import { useTimeFrame } from '../util/useTimeFrame'
import { useNetworks } from '../networks/useNetworks'
import { defaultPaginatedRequestParams } from '../util/pagination/pagination.request.params'
import React, { useMemo } from 'react'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import LoadMore from '../components/loadMore/LoadMore'
import TipsHeader from './TipsHeader'
import TipCard from './TipCard'
import Grid from '../components/grid/Grid'

const Tips = () => {
    const { t } = useTranslation()
    const { param: timeFrame } = useTimeFrame()
    const { network } = useNetworks()
    const { status, data, isLoading, fetchNextPage } = useGetTips({
        network: network.id,
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
