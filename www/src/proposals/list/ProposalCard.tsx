import React from 'react'
import { generatePath } from 'react-router-dom'
import { ROUTE_PROPOSAL } from '../../routes/routes'
import { Divider } from '../../components/divider/Divider'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { ProposalDto } from '../proposals.dto'
import { ProposalStatusIndicator } from '../status/ProposalStatusIndicator'
import { ProposalContentType } from '../proposal/ProposalContentTypeTabs'
import { ProposalIndex } from './ProposalIndex'
import { NetworkCard } from '../../components/network/NetworkCard'
import { AddressInfoWithLabel } from '../../components/identicon/AddressInfoWithLabel'
import { NetworkValue } from '../../components/network/NetworkValue'
import { CardHeader } from '../../components/card/components/CardHeader'
import { CardDetails } from '../../components/card/components/CardDetails'
import { CardTitle } from '../../components/card/components/CardTitle'

const useStyles = makeStyles(() =>
    createStyles({
        accountsWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
    }),
)

interface Props {
    proposal: ProposalDto
}

export const ProposalCard = ({ proposal: { proposalIndex, status, title, value, beneficiary, proposer } }: Props) => {
    const classes = useStyles()

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
                <CardTitle title={title} />
                <NetworkValue value={value} />
            </CardDetails>

            <Divider />

            <div className={classes.accountsWrapper}>
                <AddressInfoWithLabel label={t('proposal.list.card.beneficiary')} address={beneficiary.address} />
                <AddressInfoWithLabel label={t('proposal.list.card.proposer')} address={proposer.address} />
            </div>
        </NetworkCard>
    )
}
