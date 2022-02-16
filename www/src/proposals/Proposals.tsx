import React, { useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import ProposalsHeader from './ProposalsHeader'
import { useGetProposals } from './proposals.api'
import { useNetworks } from '../networks/useNetworks'
import { filterProposals } from './list/filterProposals'
import { useAuth } from '../auth/AuthContext'
import ProposalsList from './list/ProposalsList'
import LoadMore from '../components/loadMore/LoadMore'
import { useTranslation } from 'react-i18next'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { useTimeFrame } from '../util/useTimeFrame'
import { useProposalsFilter } from './useProposalsFilter'

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
    const { param: proposalsFilter } = useProposalsFilter()
    const { network } = useNetworks()
    const { param: timeFrame } = useTimeFrame()

    const PAGE_SIZE = 10
    const { status, isLoading, data, fetchNextPage } = useGetProposals(
        network.id,
        proposalsFilter,
        timeFrame,
        PAGE_SIZE,
    )
    const proposals = data?.pages.map((page) => page.items).flat() ?? []

    const pageNumber = data?.pages?.length ?? 0
    const canLoadMore = pageNumber * PAGE_SIZE === proposals.length

    const filteredProposals = useMemo(() => {
        return proposals ? filterProposals(proposals, proposalsFilter, user) : []
    }, [proposalsFilter, proposals, user])

    return (
        <div className={classes.root}>
            <ProposalsHeader />
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingProposals')}
                loadingText={t('loading.proposals')}
            >
                <ProposalsList proposals={filteredProposals} />
                {canLoadMore ? <LoadMore disabled={isLoading} onClick={fetchNextPage} /> : null}
            </LoadingWrapper>
        </div>
    )
}

export default Proposals
