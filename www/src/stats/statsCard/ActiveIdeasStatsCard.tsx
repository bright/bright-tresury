import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import activeIdeas from '../../assets/active_ideas.svg'
import { useGetIdeas } from '../../ideas/ideas.api'
import { filterIdeas } from '../../ideas/list/filterIdeas'
import { IdeaFilter, IdeaFilterSearchParamName } from '../../ideas/list/IdeaStatusFilters'
import { useNetworks } from '../../networks/useNetworks'
import { ROUTE_IDEAS } from '../../routes/routes'
import ImageStatsCard from './ImageStatsCard'

const ActiveIdeasStatsCard = () => {
    const { t } = useTranslation()
    const { network } = useNetworks()
    const { data: ideas } = useGetIdeas(network.id)

    const activeIdeasCount = useMemo(() => {
        if (!ideas) {
            return 0
        }
        return filterIdeas(ideas, IdeaFilter.Active).length
    }, [ideas])

    return (
        <ImageStatsCard
            name={t(`stats.names.activeIdeas`)}
            value={activeIdeasCount}
            imgSrc={activeIdeas}
            redirectTo={`${ROUTE_IDEAS}?${IdeaFilterSearchParamName}=${IdeaFilter.Active}`}
        />
    )
}

export default ActiveIdeasStatsCard
