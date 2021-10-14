import React from 'react'
import StatsHeader from './StatsHeader'
import StatsContainer from './StatsContainer'
import { useStats } from './stats.api'
import { useNetworks } from '../networks/useNetworks'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'

interface OwnProps {}

export type StatsProps = OwnProps

const Stats = ({}: StatsProps) => {
    const { network } = useNetworks()
    const { status, data: stats } = useStats(network.id)
    const { t } = useTranslation()

    return (
        <>
            {stats ? <StatsHeader timeLeft={stats.timeLeft} /> : <StatsHeader />}
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingStatistics')}
                loadingText={t('loading.stats')}
            >
                {stats ? <StatsContainer stats={stats} /> : null}
            </LoadingWrapper>
        </>
    )
}

export default Stats
