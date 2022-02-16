import { makeStyles, Theme } from '@material-ui/core/styles'
import { createStyles, Hidden } from '@material-ui/core'
import React, { useMemo } from 'react'
import Tabs, { TabEntry } from '../../components/tabs/Tabs'
import { useTranslation } from 'react-i18next'
import { breakpoints } from '../../theme/theme'
import NavSelect from '../../components/select/NavSelect'
import { useAuth } from '../../auth/AuthContext'
import {
    ProposalDefaultFilter,
    ProposalFilter,
    ProposalFilterSearchParamName,
    useProposalsFilter,
} from '../useProposalsFilter'
import { TimeFrame, useTimeFrame } from '../../util/useTimeFrame'
import { isOn } from '@polkadot/util/is/helpers'

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

const ProposalStatusFilters = () => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { isUserSignedIn } = useAuth()
    const { param: timeFrame } = useTimeFrame()
    const { param: proposalsFilter, setParam: setProposalFilter } = useProposalsFilter()
    const isOnChain = useMemo(() => timeFrame === TimeFrame.OnChain, [timeFrame])

    const filterValues = useMemo(() => {
        const filterValues = isOnChain ? Object.values(ProposalFilter) : [ProposalFilter.All, ProposalFilter.Mine]
        return isUserSignedIn ? filterValues : filterValues.filter((value) => value !== ProposalFilter.Mine)
    }, [isUserSignedIn, isOnChain])

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
        }
    }

    const getFilterOption = (filter: ProposalFilter) => {
        return {
            isDefault: filter === ProposalDefaultFilter,
            label: getTranslation(filter),
            filterName: filter,
            path: setProposalFilter(filter),
        } as TabEntry
    }
    const filterOptions = filterValues.map((filter: ProposalFilter) => getFilterOption(filter))

    /**
     * Current tab entry is forced, because there should be always some filter specified.
     */
    const currentFilterOption = filterOptions.find((entry) => entry.label === getTranslation(proposalsFilter))!

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
