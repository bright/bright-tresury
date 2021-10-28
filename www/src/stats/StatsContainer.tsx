import React from 'react'
import Grid from '../components/grid/Grid'
import proposalsSubmitted from '../assets/proposals_submitted.svg'
import proposalsApproved from '../assets/proposals_approved.svg'
import calendar from '../assets/calendar.svg'
import clock from '../assets/clock.svg'
import wallet from '../assets/wallet.svg'
import coin from '../assets/coin.svg'
import ActiveIdeasStatsCard from './statsCard/ActiveIdeasStatsCard'
import ImageStatsCard from './statsCard/ImageStatsCard'
import SpendingPeriodCard from './statsCard/SpendingPeriodCard'
import { StatsDto } from './stats.dto'
import { useTranslation } from 'react-i18next'
import TimeStatsCard from './statsCard/TimeStatsCard'
import CurrencyAmountStatsCard from './statsCard/CurrencyAmountStatsCard'
import { useNetworks } from '../networks/useNetworks'
import { toNetworkDisplayValue } from '../util/quota.util'

interface OwnProps {
    stats: StatsDto
}

export type StatsContainerProps = OwnProps

const StatsContainer = ({ stats }: StatsContainerProps) => {
    const { t } = useTranslation()
    const {network} = useNetworks()
    // TODO: ask why our Grid.tsx is using GridItem that uses MaterialGrid again? (why nested grids)
    return (
        <Grid xs={12} sm={6} md={4}>
            <ImageStatsCard
                name={t('stats.names.proposalsSubmitted')}
                value={stats.submitted}
                imgSrc={proposalsSubmitted}
            />
            <ImageStatsCard
                name={t(`stats.names.proposalsApproved`)}
                value={stats.approved}
                imgSrc={proposalsApproved}
            />
            <ActiveIdeasStatsCard />
            <TimeStatsCard name={t(`stats.names.spendPeriod`)} value={stats.spendPeriod} imgSrc={calendar} />
            <TimeStatsCard name={t(`stats.names.timeLeft`)} value={stats.timeLeft} imgSrc={clock} />
            <SpendingPeriodCard name={t(`stats.names.leftOfSpendingPeriod`)} value={stats.leftOfSpendingPeriod} />
            <CurrencyAmountStatsCard name={t(`stats.names.available`)} value={toNetworkDisplayValue(stats.availableBalance, network.decimals)} imgSrc={wallet} />
            <CurrencyAmountStatsCard name={t(`stats.names.nextBurn`)} value={toNetworkDisplayValue(stats.nextFoundsBurn, network.decimals)} imgSrc={coin} />
        </Grid>
    )
}

export default StatsContainer
