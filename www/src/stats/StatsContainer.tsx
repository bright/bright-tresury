import React from 'react'
import Grid from '../components/grid/Grid'
import proposalsSubmitted from '../assets/proposals_submitted.svg'
import proposalsRejected from '../assets/proposals_rejected.svg'
import proposalsApproved from '../assets/proposals_approved.svg'
import calendar from '../assets/calendar.svg'
import clock from '../assets/clock.svg'
import wallet from '../assets/wallet.svg'
import coin from '../assets/coin.svg'
import ProposalsStatsCard from './statsCard/ProposalsStatsCard'
import SpendingPeriodCard from './statsCard/SpendingPeriodCard'
import { StatsDto } from './stats.dto'
import { useTranslation } from 'react-i18next'
import TimeStatsCard from './statsCard/TimeStatsCard'
import CurrencyAmountStatsCard from './statsCard/CurrencyAmountStatsCard'

interface OwnProps {
    stats: StatsDto
}

export type StatsContainerProps = OwnProps

const StatsContainer = ({ stats }: StatsContainerProps) => {
    const { t } = useTranslation()
    // TODO: ask why our Grid.tsx is using GridItem that uses MaterialGrid again? (why nested grids)
    return (
        <Grid xs={12} sm={6} md={4}>
            <ProposalsStatsCard
                name={t('stats.names.proposalsSubmitted')}
                value={stats.submitted}
                imgSrc={proposalsSubmitted}
            />
            <ProposalsStatsCard
                name={t(`stats.names.proposalsApproved`)}
                value={stats.approved}
                imgSrc={proposalsApproved}
            />
            <ProposalsStatsCard
                name={t(`stats.names.proposalsRejected`)}
                value={stats.rejected}
                imgSrc={proposalsRejected}
            />
            <TimeStatsCard name={t(`stats.names.spendPeriod`)} value={stats.spendPeriod} imgSrc={calendar} />
            <TimeStatsCard name={t(`stats.names.timeLeft`)} value={stats.timeLeft} imgSrc={clock} />
            <SpendingPeriodCard name={t(`stats.names.leftOfSpendingPeriod`)} value={stats.leftOfSpendingPeriod} />
            <CurrencyAmountStatsCard name={t(`stats.names.available`)} value={stats.availableBalance} imgSrc={wallet} />
            <CurrencyAmountStatsCard name={t(`stats.names.nextBurn`)} value={stats.nextFoundsBurn} imgSrc={coin} />
        </Grid>
    )
}

export default StatsContainer
