import React from 'react'
import { useTranslation } from 'react-i18next'
import { ROUTE_IDEAS } from '../../routes/routes'
import { useAuth } from '../../auth/AuthContext'
import Filters from '../../components/filters/Filters'

export enum IdeaFilter {
    All = 'all',
    Mine = 'mine',
    Draft = 'draft',
    Active = 'active',
    TurnedIntoProposal = 'turnedIntoProposal',
    Closed = 'closed',
}

const getFilterValues = (isUserSignedIn: boolean): IdeaFilter[] => {
    const filterValues = Object.values(IdeaFilter)
    return isUserSignedIn ? filterValues : filterValues.filter((value) => value !== IdeaFilter.Mine)
}

export const IdeaFilterSearchParamName = 'filter'
export const IdeaDefaultFilter = IdeaFilter.All

interface OwnProps {
    selectedFilter: IdeaFilter
}

export type IdeaStatusFiltersProps = OwnProps

const IdeaStatusFilters = ({ selectedFilter }: IdeaStatusFiltersProps) => {
    const { t } = useTranslation()
    const { isUserSignedIn } = useAuth()

    const getTranslation = (ideaFilter: IdeaFilter): string => {
        switch (ideaFilter) {
            case IdeaFilter.All:
                return t('idea.list.filters.all')
            case IdeaFilter.Mine:
                return t('idea.list.filters.mine')
            case IdeaFilter.Draft:
                return t('idea.list.filters.draft')
            case IdeaFilter.Active:
                return t('idea.list.filters.active')
            case IdeaFilter.TurnedIntoProposal:
                return t('idea.list.filters.turnedIntoProposal')
            case IdeaFilter.Closed:
                return t('idea.list.filters.closed')
        }
    }

    const filterValues = getFilterValues(isUserSignedIn)

    const getFilterOption = (filter: IdeaFilter) => {
        return {
            isDefault: filter === IdeaDefaultFilter,
            label: getTranslation(filter),
            path: `${ROUTE_IDEAS}?${IdeaFilterSearchParamName}=${filter}`,
            filterName: filter,
        }
    }
    const filterOptions = filterValues.map((filter: IdeaFilter) => getFilterOption(filter))

    /**
     * Current tab entry is forced, because there should be always some filter specified.
     */
    const currentFilterOption = filterOptions.find((entry) => entry.label === getTranslation(selectedFilter))!

    return (
        <Filters
            searchParamName={IdeaFilterSearchParamName}
            currentFilterOption={currentFilterOption}
            filterOptions={filterOptions}
        />
    )
}

export default IdeaStatusFilters
