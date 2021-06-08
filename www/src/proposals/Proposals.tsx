import React, { useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { LoadingWrapper } from '../components/loading/LoadingWrapper'
import { useGetProposals } from './proposals.api'
import config from '../config'
import { useLocation } from 'react-router-dom'
import ProposalsList from './list/ProposalsList'
import { ProposalDefaultFilter, ProposalFilter, ProposalFilterSearchParamName } from './list/ProposalStatusFilters'
import { filterProposals } from './list/filterProposals'
import { useTranslation } from 'react-i18next'
import ProposalsHeader from './ProposalsHeader'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
        },
    }),
)

export interface ProposalsProps {
    network: string
}

const Proposals = ({ network = config.NETWORK_NAME }: ProposalsProps) => {
    const classes = useStyles()

    const { t } = useTranslation()

    const location = useLocation()

    const { status, data: proposals } = useGetProposals(network)

    const filter = useMemo(() => {
        const filterParam = new URLSearchParams(location.search).get(ProposalFilterSearchParamName)
        return filterParam ? (filterParam as ProposalFilter) : ProposalDefaultFilter
    }, [location.search])

    const filteredProposals = useMemo(() => {
        return proposals ? filterProposals(proposals, filter) : []
    }, [filter, proposals])

    return (
        <div className={classes.root}>
            <ProposalsHeader filter={filter} />
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
