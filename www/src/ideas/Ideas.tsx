import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { getIdeas } from './ideas.api'
import { IdeaDefaultFilter, IdeaFilter, IdeaFilterSearchParamName } from './list/IdeaStatusFilters'
import config from '../config'
import { filterIdeas } from './list/filterIdeas'
import IdeasHeader from './IdeasHeader'
import { IdeasList } from './list/IdeasList'
import { UseQueryWrapper } from '../components/loading/UseQueryWrapper'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

interface Props {
    network: string
}

export const Ideas = ({ network = config.NETWORK_NAME }: Props) => {
    const { t } = useTranslation()

    const location = useLocation()

    const { status, data: ideas } = useQuery(['ideas', network], () => getIdeas(network))

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
            <UseQueryWrapper status={status} error={t('errors.errorOccurredWhileLoadingIdeas')}>
                <IdeasList ideas={filteredIdeas} />
            </UseQueryWrapper>
        </div>
    )
}
