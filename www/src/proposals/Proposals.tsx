import React, { useEffect, useMemo } from 'react'
import { ProposalsHeader } from './ProposalsHeader'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { LoadingWrapper, useLoading } from '../components/loading/LoadingWrapper'
import { getProposals } from './proposals.api'
import config from '../config'
import { useLocation } from 'react-router-dom'
import { ProposalsList } from './list/ProposalsList'
import { ProposalDefaultFilter, ProposalFilter, ProposalFilterSearchParamName } from './list/ProposalStatusFilters'
import { filterProposals } from './list/filterProposals'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
        },
    }),
)

interface Props {
    networkName: string
}

export const Proposals = ({ networkName = config.NETWORK_NAME }: Props) => {
    const classes = useStyles()

    const location = useLocation()

    const { loadingState, response: proposals, call } = useLoading(getProposals)

    useEffect(() => {
        call(networkName)
    }, [networkName, call])

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
            <LoadingWrapper loadingState={loadingState}>
                <ProposalsList proposals={filteredProposals} />
            </LoadingWrapper>
        </div>
    )
}
