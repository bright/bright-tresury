import React from 'react'
import NavSelect from '../components/select/NavSelect'
import { ROUTE_STATS } from '../routes/routes'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { createStyles, Hidden } from '@material-ui/core'
import { breakpoints } from '../theme/theme'
import Tabs from '../components/tabs/Tabs'
import { useTranslation } from 'react-i18next'

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

export enum StatsFilter {
    Proposals = 'proposals',
    Bounty = 'bounty',
    Ideas = 'ideas',
    Tips = 'tips',
}

export const StatsDefaultFilter = StatsFilter.Proposals

export const StatsFilterSearchParamName = 'statsFilter'

interface OwnProps {
    selectedStatsFilter: StatsFilter
}

export type StatsOptionsProps = OwnProps

const StatsStatusFilters = ({ selectedStatsFilter }: StatsOptionsProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const getTranslation = (statsFilter: StatsFilter): string => {
        switch (statsFilter) {
            case StatsFilter.Proposals:
                return t('stats.filters.proposals')
            case StatsFilter.Bounty:
                return t('stats.filters.bounty')
            case StatsFilter.Ideas:
                return t('stats.filters.ideas')
            case StatsFilter.Tips:
                return t('stats.filters.tips')
        }
    }

    const getStatsFilterOption = (statsFilter: StatsFilter) => {
        return {
            isDefault: statsFilter === StatsDefaultFilter,
            label: getTranslation(statsFilter),
            path: `${ROUTE_STATS}?${StatsFilterSearchParamName}=${statsFilter}`,
            filterName: statsFilter,
        }
    }

    const statsFilterValues = Object.values(StatsFilter)

    const statsFilterOptions = statsFilterValues.map((statsFilter: StatsFilter) => getStatsFilterOption(statsFilter))
    const currentFilterOption = statsFilterOptions.find((entry) => entry.label === selectedStatsFilter!)

    return (
        <div>
            <Hidden only={breakpoints.mobile}>
                <Tabs searchParamName={StatsFilterSearchParamName} values={statsFilterOptions} />
            </Hidden>
            <NavSelect className={classes.filterSelect} value={currentFilterOption} options={statsFilterOptions} />
        </div>
    )
}

export default StatsStatusFilters
