import React, { useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import ProposalsHeader from './ProposalsHeader'
import { useGetProposals } from './proposals.api'
import { useNetworks } from '../networks/useNetworks'
import { useAuth } from '../auth/AuthContext'
import ProposalsList from './list/ProposalsList'
import LoadMore from '../components/loadMore/LoadMore'
import { useTranslation } from 'react-i18next'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { useTimeFrame } from '../util/useTimeFrame'
import { ProposalFilter, useProposalsFilter } from './useProposalsFilter'
import { ProposalStatus } from './proposals.dto'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
        },
    }),
)
const getProposalStatus = (filter: ProposalFilter) => {
    switch (filter) {
        case ProposalFilter.Submitted:
            return ProposalStatus.Submitted
        case ProposalFilter.Approved:
            return ProposalStatus.Approved
        default:
            return null
    }
}
const Proposals = () => {
    const classes = useStyles()

    const { t } = useTranslation()
    const { user } = useAuth()
    const { param: proposalsFilter } = useProposalsFilter()
    const { network } = useNetworks()
    const { param: timeFrame } = useTimeFrame()

    const PAGE_SIZE = 10
    const { status, isLoading, data, fetchNextPage } = useGetProposals({
        network: network.id,
        ownerId: proposalsFilter === ProposalFilter.Mine ? user?.id : null,
        status: getProposalStatus(proposalsFilter),
        timeFrame,
        pageNumber: 1,
        pageSize: PAGE_SIZE,
    })
    const proposals = useMemo(() => data?.pages.map((page) => page.items).flat() ?? [], [data])
    const pageNumber = useMemo(() => data?.pages?.length ?? 0, [data])
    const canLoadMore = useMemo(() => pageNumber * PAGE_SIZE === proposals.length, [pageNumber, proposals])

    return (
        <div className={classes.root}>
            <ProposalsHeader />
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingProposals')}
                loadingText={t('loading.proposals')}
            >
                <ProposalsList proposals={proposals} />
                {canLoadMore ? <LoadMore disabled={isLoading} onClick={fetchNextPage} /> : null}
            </LoadingWrapper>
        </div>
    )
}

export default Proposals
