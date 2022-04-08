import { useGetTips } from './tips.api'
import { useTimeFrame } from '../util/useTimeFrame'
import { useNetworks } from '../networks/useNetworks'
import { defaultPaginatedRequestParams } from '../util/pagination/pagination.request.params'
import React, { useMemo } from 'react'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import LoadMore from '../components/loadMore/LoadMore'
import TipsHeader from './TipsHeader'
import CardsList from '../components/cardsList/CardsList'
import { TipDto } from './tip.dto'
import TipCard from './TipCard'

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
                <CardsList<TipDto> items={tips} renderCard={(tip: TipDto) => <TipCard item={tip} />} />
            </LoadingWrapper>
            {canLoadMore ? <LoadMore disabled={isLoading} onClick={fetchNextPage} /> : null}
        </>
    )
}

export default Tips
