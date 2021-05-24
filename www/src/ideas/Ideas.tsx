import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useGetIdeas } from './ideas.api'
import { IdeaDefaultFilter, IdeaFilter, IdeaFilterSearchParamName } from './list/IdeaStatusFilters'
import config from '../config'
import { filterIdeas } from './list/filterIdeas'
import IdeasHeader from './IdeasHeader'
import { IdeasList } from './list/IdeasList'
import { LoadingWrapper } from '../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'

interface Props {
    network: string
}

export const Ideas = ({ network = config.NETWORK_NAME }: Props) => {
    const { t } = useTranslation()

    const location = useLocation()

    const { status, data: ideas } = useGetIdeas(network)

    const filter = useMemo(() => {
        const filterParam = new URLSearchParams(location.search).get(IdeaFilterSearchParamName)
        return filterParam ? (filterParam as IdeaFilter) : IdeaDefaultFilter
    }, [location.search])

    const filteredIdeas = useMemo(() => {
        return ideas ? filterIdeas(ideas, filter) : []
    }, [filter, ideas])

    return (
        <div>
            <IdeasHeader filter={filter} />
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingIdeas')}
                loadingText={t('loading.ideas')}
            >
                <IdeasList ideas={filteredIdeas} />
            </LoadingWrapper>
        </div>
    )
}
