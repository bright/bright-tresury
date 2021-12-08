import React, { useMemo, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useLocation } from 'react-router-dom'
import { ProposalDefaultFilter, ProposalFilter, ProposalFilterSearchParamName } from './list/ProposalStatusFilters'
import ProposalsHeader from './ProposalsHeader'
import { TimeFrame } from '../components/select/TimeSelect'
import { useGetProposals } from './proposals.api'
import { useNetworks } from '../networks/useNetworks'
import { filterProposals } from './list/filterProposals'
import { useAuth } from '../auth/AuthContext'
import ProposalsList from './list/ProposalsList'
import LoadMore from '../components/loadMore/LoadMore'
import { useTranslation } from 'react-i18next'
import LoadingWrapper from '../components/loading/LoadingWrapper'

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

    const [timeFrame, setTimeFrame] = useState(TimeFrame.OnChain)

    const { status, remove, isLoading, data, fetchNextPage } = useGetProposals(network.id, timeFrame)
    const proposals = data?.pages.map(page => page.items).flat() ?? []
    const total = data?.pages[0].total ?? 0
    const canLoadMore = proposals.length < total

    const onTimeFrameChange = (newTimeFrame: TimeFrame) => {
        remove()
        setTimeFrame(newTimeFrame)
    }

    const selectedFilter = useMemo(() => {
        const filterParam = new URLSearchParams(location.search).get(ProposalFilterSearchParamName)
        return filterParam ? (filterParam as ProposalFilter) : ProposalDefaultFilter
    }, [location.search])

    const filteredProposals = useMemo(() => {
        return proposals ? filterProposals(proposals, selectedFilter, user) : []
    }, [selectedFilter, proposals, user])

    const isCurrentSpendPeriod = timeFrame === TimeFrame.OnChain

    return (
        <div className={classes.root}>
            <ProposalsHeader selectedFilter={selectedFilter} selectedTimeFrame={timeFrame} onTimeFrameChange={onTimeFrameChange} />
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingProposals')}
                loadingText={t('loading.proposals')}
            >
                <ProposalsList
                    proposals={isCurrentSpendPeriod ? filteredProposals : proposals }
                    disableCards={!isCurrentSpendPeriod}
                    showStatus={isCurrentSpendPeriod}
                />
                { canLoadMore ? <LoadMore disabled={isLoading} onClick={fetchNextPage} /> : null}
            </LoadingWrapper>
        </div>
    )
}

export default Proposals
