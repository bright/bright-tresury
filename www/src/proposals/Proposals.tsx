import React, { useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { useNetworks } from '../networks/useNetworks'
import { useGetProposals } from './proposals.api'
import { useLocation } from 'react-router-dom'
import ProposalsList from './list/ProposalsList'
import { ProposalDefaultFilter, ProposalFilter, ProposalFilterSearchParamName } from './list/ProposalStatusFilters'
import { filterProposals } from './list/filterProposals'
import { useTranslation } from 'react-i18next'
import ProposalsHeader from './ProposalsHeader'
import { useAuth } from '../auth/AuthContext'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
        },
    }),
)

const Proposals = () => {
    const classes = useStyles()

    const { t } = useTranslation()

    const { user } = useAuth()

    const location = useLocation()

    const { network } = useNetworks()
    const { status, data: proposals } = useGetProposals(network.id)

    const selectedFilter = useMemo(() => {
        const filterParam = new URLSearchParams(location.search).get(ProposalFilterSearchParamName)
        return filterParam ? (filterParam as ProposalFilter) : ProposalDefaultFilter
    }, [location.search])

    const filteredProposals = useMemo(() => {
        return proposals ? filterProposals(proposals, selectedFilter, user) : []
    }, [selectedFilter, proposals, user])

    return (
        <div className={classes.root}>
            <ProposalsHeader selectedFilter={selectedFilter} />
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingProposals')}
                loadingText={t('loading.proposals')}
            >
                <ProposalsList proposals={filteredProposals} />
            </LoadingWrapper>
        </div>
    )
}

export default Proposals
