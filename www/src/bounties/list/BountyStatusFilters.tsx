import { createStyles, Hidden } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../auth/AuthContext'
import NavSelect from '../../components/select/NavSelect'
import { TimeFrame } from '../../components/select/TimeSelect'
import Tabs from '../../components/tabs/Tabs'
import { ROUTE_BOUNTIES } from '../../routes/routes'
import { breakpoints } from '../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        filterSelect: {
            fontWeight: 600,
            display: 'initial',
            [theme.breakpoints.up(breakpoints.tablet)]: {
                display: 'none',
            },
        },
    }),
)

export enum BountyFilter {
    All = 'all',
    Mine = 'mine',
    Proposed = 'proposed',
    Approved = 'approved',
    Funded = 'funded',
    CuratorProposed = 'curator-proposed',
    Active = 'active',
    PendingPayout = 'pending-payout',
    Claimed = 'claimed',
    Rejected = 'rejected',
}

const ON_CHAIN_FILTER_VALUES = [
    BountyFilter.Proposed,
    BountyFilter.Approved,
    BountyFilter.Funded,
    BountyFilter.CuratorProposed,
    BountyFilter.Active,
    BountyFilter.PendingPayout,
]
const HISTORY_FILTER_VALUES = [BountyFilter.Claimed, BountyFilter.Rejected]

export const BountyFilterSearchParamName = 'filter'
export const BountyDefaultFilter = BountyFilter.All

interface OwnProps {
    selectedFilter: BountyFilter
    selectedTimeFrame: TimeFrame
}

export type BountyStatusFiltersProps = OwnProps

const BountyStatusFilters = ({ selectedFilter, selectedTimeFrame }: BountyStatusFiltersProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { isUserSignedIn } = useAuth()

    const getTranslation = (bountyFilter: BountyFilter): any => {
        switch (bountyFilter) {
            case BountyFilter.All:
                return t('bounty.list.filters.all')
            case BountyFilter.Mine:
                return t('bounty.list.filters.mine')
            case BountyFilter.Proposed:
                return t('bounty.list.filters.proposed')
            case BountyFilter.Approved:
                return t('bounty.list.filters.approved')
            case BountyFilter.Funded:
                return t('bounty.list.filters.funded')
            case BountyFilter.CuratorProposed:
                return t('bounty.list.filters.curatorProposed')
            case BountyFilter.Active:
                return t('bounty.list.filters.active')
            case BountyFilter.PendingPayout:
                return t('bounty.list.filters.pendingPayout')
            case BountyFilter.Claimed:
                return t('bounty.list.filters.claimed')
            case BountyFilter.Rejected:
                return t('bounty.list.filters.rejected')
        }
    }

    const filterValues = useMemo(() => {
        const filterValues = [BountyFilter.All]
        if (isUserSignedIn) {
            filterValues.push(BountyFilter.Mine)
        }
        return filterValues.concat(
            selectedTimeFrame === TimeFrame.OnChain ? ON_CHAIN_FILTER_VALUES : HISTORY_FILTER_VALUES,
        )
    }, [isUserSignedIn, selectedTimeFrame])

    const getFilterOption = (filter: BountyFilter) => {
        return {
            isDefault: filter === BountyDefaultFilter,
            label: getTranslation(filter),
            path: `${ROUTE_BOUNTIES}?${BountyFilterSearchParamName}=${filter}`,
            filterName: filter,
        }
    }
    const filterOptions = filterValues.map((filter: BountyFilter) => getFilterOption(filter))

    /**
     * Current tab entry is forced, because there should be always some filter specified.
     */
    const currentFilterOption = filterOptions.find((entry) => entry.label === getTranslation(selectedFilter))!

    return (
        <div>
            <Hidden only={breakpoints.mobile}>
                <Tabs searchParamName={BountyFilterSearchParamName} values={filterOptions} />
            </Hidden>
            <NavSelect className={classes.filterSelect} value={currentFilterOption} options={filterOptions} />
        </div>
    )
}

export default BountyStatusFilters
