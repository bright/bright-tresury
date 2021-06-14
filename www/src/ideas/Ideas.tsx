import React, { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useGetIdeas } from './ideas.api'
import { IdeaDefaultFilter, IdeaFilter, IdeaFilterSearchParamName } from './list/IdeaStatusFilters'
import config from '../config'
import { filterIdeas } from './list/filterIdeas'
import IdeasHeader from './IdeasHeader'
import IdeasList from './list/IdeasList'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthContext'

export interface IdeasProps {
    network: string
}

const Ideas = ({ network = config.NETWORK_NAME }: IdeasProps) => {
    const { t } = useTranslation()

    const { search } = useLocation()

    const { user } = useAuth()

    const { status, data: ideas, refetch } = useGetIdeas(network)

    useEffect(() => {
        refetch()
    }, [user])

    const filter = useMemo(() => {
        const filterParam = new URLSearchParams(search).get(IdeaFilterSearchParamName)
        return filterParam ? (filterParam as IdeaFilter) : IdeaDefaultFilter
    }, [search])

    const filteredIdeas = useMemo(() => {
        return ideas ? filterIdeas(ideas, filter, user) : []
    }, [ideas, filter, user])

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

export default Ideas
