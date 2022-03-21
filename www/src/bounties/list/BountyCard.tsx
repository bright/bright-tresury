import React from 'react'
import { useNetworks } from '../../networks/useNetworks'
import Divider from '../../components/divider/Divider'
import { useTranslation } from 'react-i18next'
import NetworkCard from '../../components/network/NetworkCard'
import CardHeader from '../../components/card/components/CardHeader'
import CardDetails from '../../components/card/components/CardDetails'
import CardTitle from '../../components/card/components/CardTitle'
import OrdinalNumber from '../../components/ordinalNumber/OrdinalNumber'
import { toNetworkDisplayValue } from '../../util/quota.util'
import NetworkValue from '../../components/network/NetworkValue'
import { BountyDto, BountyStatus } from '../bounties.dto'
import { generatePath } from 'react-router-dom'
import { ROUTE_BOUNTY } from '../../routes/routes'
import { BountyContentType } from '../bounty/Bounty'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'
import BountyStatusIndicator from '../components/BountyStatusIndicator'
import User from '../../components/user/User'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        usersInfoContainer: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
            },
        },
    }),
)

interface OwnProps {
    bounty: BountyDto
    disable?: boolean
    showStatus?: boolean
}

export type BountyCardProps = OwnProps

const BountyCard = ({ bounty, disable = false, showStatus = true }: BountyCardProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()
    const classes = useStyles()

    const redirectTo = `${generatePath(ROUTE_BOUNTY, { bountyIndex: bounty.blockchainIndex })}/${
        BountyContentType.Info
    }`

    return (
        <NetworkCard redirectTo={disable ? undefined : redirectTo}>
            <CardHeader>
                <OrdinalNumber prefix={t('bounty.indexPrefix')} ordinalNumber={bounty.blockchainIndex} />
                {showStatus ? <BountyStatusIndicator status={bounty.status} /> : null}
            </CardHeader>

            <Divider />

            <CardDetails>
                <CardTitle title={bounty.title ?? bounty.polkassembly?.title ?? bounty.blockchainDescription} />
                <NetworkValue value={toNetworkDisplayValue(bounty.value, network.decimals)} />
            </CardDetails>

            <Divider />

            <div className={classes.usersInfoContainer}>
                <User label={t('bounty.list.proposer')} user={{ web3address: bounty.proposer.address }} />
                {bounty.status === BountyStatus.CuratorProposed ? (
                    <User label={t('bounty.list.curatorProposed')} user={{ web3address: bounty.curator.address }} />
                ) : null}
                {bounty.status === BountyStatus.Active || bounty.status === BountyStatus.PendingPayout ? (
                    <User label={t('bounty.list.curator')} user={{ web3address: bounty.curator.address }} />
                ) : null}
            </div>
        </NetworkCard>
    )
}

export default BountyCard
