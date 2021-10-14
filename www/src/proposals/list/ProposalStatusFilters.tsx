import { makeStyles, Theme } from '@material-ui/core/styles'
import { createStyles, Hidden } from '@material-ui/core'
import React from 'react'
import Tabs, { TabEntry } from '../../components/tabs/Tabs'
import { useTranslation } from 'react-i18next'
import { breakpoints } from '../../theme/theme'
import { ROUTE_PROPOSALS } from '../../routes/routes'
import NavSelect from '../../components/select/NavSelect'
import { useAuth } from '../../auth/AuthContext'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        filterSelect: {
            display: 'none',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontWeight: 600,
                display: 'flex',
                marginRight: 0,
            },
        },
    }),
)

export enum ProposalFilter {
    All = 'all',
    Mine = 'mine',
    Submitted = 'submitted',
    Approved = 'approved',
    Rejected = 'rejected',
    Rewarded = 'rewarded',
}

const getFilterValues = (isUserSignedIn: boolean): ProposalFilter[] => {
    const filterValues = Object.values(ProposalFilter)
    return isUserSignedIn ? filterValues : filterValues.filter((value) => value !== ProposalFilter.Mine)
}

export const ProposalFilterSearchParamName = 'filter'
export const ProposalDefaultFilter = ProposalFilter.All

interface OwnProps {
    selectedFilter: ProposalFilter
}

export type ProposalStatusFiltersProps = OwnProps

const ProposalStatusFilters = ({ selectedFilter }: ProposalStatusFiltersProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { isUserSignedIn } = useAuth()

    const getTranslation = (proposalFilter: ProposalFilter): string => {
        switch (proposalFilter) {
            case ProposalFilter.All:
                return t('proposal.list.filters.all')
            case ProposalFilter.Mine:
                return t('proposal.list.filters.mine')
            case ProposalFilter.Submitted:
                return t('proposal.list.filters.submitted')
            case ProposalFilter.Approved:
                return t('proposal.list.filters.approved')
            case ProposalFilter.Rejected:
                return t('proposal.list.filters.rejected')
            case ProposalFilter.Rewarded:
                return t('proposal.list.filters.rewarded')
        }
    }

    const filterValues = getFilterValues(isUserSignedIn)

    const getFilterOption = (filter: ProposalFilter) => {
        return {
            isDefault: filter === ProposalDefaultFilter,
            label: getTranslation(filter),
            filterName: filter,
            path: `${ROUTE_PROPOSALS}?${ProposalFilterSearchParamName}=${filter}`,
        } as TabEntry
    }
    const filterOptions = filterValues.map((filter: ProposalFilter) => getFilterOption(filter))

    /**
     * Current tab entry is forced, because there should be always some filter specified.
     */
    const currentFilterOption = filterOptions.find((entry) => entry.label === getTranslation(selectedFilter))!

    return (
        <div>
            <Hidden only={breakpoints.mobile}>
                <Tabs searchParamName={ProposalFilterSearchParamName} values={filterOptions} />
            </Hidden>
            <NavSelect className={classes.filterSelect} value={currentFilterOption} options={filterOptions} />
        </div>
    )
}

export default ProposalStatusFilters
