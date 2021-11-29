import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import BountiesHeader from './BountiesHeader'
import BountiesList from './list/BountiesList'
import { useGetBounties } from './bounties.api'
import { useNetworks } from '../networks/useNetworks'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { filterBounties } from './list/filterBounties'
import { BountyDefaultFilter, BountyFilter, BountyFilterSearchParamName } from './list/BountyStatusFilters'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
        },
    }),
)

const Bounties = () => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { network } = useNetworks()
    const { search } = useLocation()
    const { user } = useAuth()

    const { status, data: bounties, refetch } = useGetBounties(network.id)

    const selectedFilter = useMemo(() => {
        const filterParam = new URLSearchParams(search).get(BountyFilterSearchParamName)
        return filterParam ? (filterParam as BountyFilter) : BountyDefaultFilter
    }, [search])

    const filteredBounties = useMemo(() => {
        return bounties ? filterBounties(bounties, selectedFilter) : []
    }, [bounties, selectedFilter, user])

    return (
        <div className={classes.root}>
            <BountiesHeader selectedFilter={selectedFilter} />
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingBounties')}
                loadingText={t('loading.bounties')}
            >
                <BountiesList bounties={filteredBounties} />
            </LoadingWrapper>
        </div>
    )
}

export default Bounties
