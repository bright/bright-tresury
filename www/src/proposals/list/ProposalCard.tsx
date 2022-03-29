import React from 'react'
import { generatePath } from 'react-router-dom'
import { ROUTE_PROPOSAL } from '../../routes/routes'
import Divider from '../../components/divider/Divider'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { ProposalDto } from '../proposals.dto'
import ProposalStatusIndicator from '../status/ProposalStatusIndicator'
import { ProposalContentType } from '../proposal/ProposalContentTypeTabs'
import ProposalIndex from './ProposalIndex'
import NetworkCard from '../../components/network/NetworkCard'
import NetworkValue from '../../components/network/NetworkValue'
import CardHeader from '../../components/card/components/CardHeader'
import CardDetails from '../../components/card/components/CardDetails'
import CardTitle from '../../components/card/components/CardTitle'
import { toNetworkDisplayValue } from '../../util/quota.util'
import { useNetworks } from '../../networks/useNetworks'
import User from '../../components/user/User'

const useStyles = makeStyles(() =>
    createStyles({
        accountsWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
    }),
)

interface OwnProps {
    proposal: ProposalDto
}

export type ProposalCardProps = OwnProps

const ProposalCard = ({
    proposal: { proposalIndex, status, details, value, beneficiary, proposer, polkassembly },
}: ProposalCardProps) => {
    const classes = useStyles()
    const { network } = useNetworks()
    const { t } = useTranslation()

    const redirectTo = `${generatePath(ROUTE_PROPOSAL, { proposalIndex })}/${ProposalContentType.Info}`
    return (
        <NetworkCard redirectTo={redirectTo}>
            <CardHeader>
                <ProposalIndex proposalIndex={proposalIndex} />
                <ProposalStatusIndicator status={status} />
            </CardHeader>

            <Divider />

            <CardDetails>
                <CardTitle title={details?.title ?? polkassembly?.title} />
                <NetworkValue value={toNetworkDisplayValue(value, network.decimals)} />
            </CardDetails>

            <Divider />

            <div className={classes.accountsWrapper}>
                <User label={t('proposal.list.card.beneficiary')} user={beneficiary} />
                <User label={t('proposal.list.card.proposer')} user={proposer} />
            </div>
        </NetworkCard>
    )
}

export default ProposalCard
