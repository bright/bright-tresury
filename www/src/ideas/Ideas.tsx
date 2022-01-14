import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useNetworks } from '../networks/useNetworks'
import { useGetIdeas } from './ideas.api'
import { IdeaDefaultFilter, IdeaFilter, IdeaFilterSearchParamName } from './list/IdeaStatusFilters'
import { filterIdeas } from './list/filterIdeas'
import IdeasHeader from './IdeasHeader'
import IdeasList from './list/IdeasList'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthContext'

const Ideas = () => {
    const { t } = useTranslation()

    const { search } = useLocation()

    const { user } = useAuth()

    const { network } = useNetworks()

    const { status, data: ideas, refetch } = useGetIdeas(network.id)

    useEffect(() => {
        refetch()
    }, [user])

    const selectedFilter = useMemo(() => {
        const filterParam = new URLSearchParams(search).get(IdeaFilterSearchParamName)
        return filterParam ? (filterParam as IdeaFilter) : IdeaDefaultFilter
    }, [search])

    const filteredIdeas = useMemo(() => {
        return ideas ? filterIdeas(ideas, selectedFilter, user) : []
    }, [ideas, selectedFilter, user])

    return (
        <div>
            <IdeasHeader selectedFilter={selectedFilter} />
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
