import React, { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { getIdeas } from './ideas.api'
import { IdeaDefaultFilter, IdeaFilter, IdeaFilterSearchParamName } from './list/IdeaStatusFilters'
import config from '../config'
import { filterIdeas } from './list/filterIdeas'
import IdeasHeader from './IdeasHeader'
import { IdeasList } from './list/IdeasList'
import { LoadingWrapper } from '../components/loading/LoadingWrapper'
import { useLoading } from '../components/loading/useLoading'
import { useTranslation } from 'react-i18next'

interface Props {
    network: string
}

const Ideas = ({ network = config.NETWORK_NAME }: Props) => {
    const { t } = useTranslation()

    const location = useLocation()

    const { loadingState, response: ideas, call } = useLoading(getIdeas)

    useEffect(() => {
        call(network)
    }, [network, call])

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
            <LoadingWrapper loadingState={loadingState} errorMessage={t('errors.errorOccurredWhileLoadingIdeas')}>
                <IdeasList ideas={filteredIdeas} />
            </LoadingWrapper>
        </div>
    )
}

export default Ideas
