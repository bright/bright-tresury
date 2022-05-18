import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNetworks } from '../../../../networks/useNetworks'
import { BountyDto, BountyStatus } from '../../../bounties.dto'
import NetworkCard from '../../../../components/network/NetworkCard'
import OrdinalNumber from '../../../../components/ordinalNumber/OrdinalNumber'
import Divider from '../../../../components/divider/Divider'
import CardDetails from '../../../../components/card/components/CardDetails'
import CardTitle from '../../../../components/card/components/CardTitle'
import NetworkValue from '../../../../components/network/NetworkValue'
import User from '../../../../components/user/User'
import { toNetworkDisplayValue } from '../../../../util/quota.util'
import { breakpoints } from '../../../../theme/theme'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import ChildBountyStatusIndicator from '../ChildBountyStatusIndicator'
import { ChildBountyDto } from '../child-bounties.dto'
import CardHeader from '../../../../components/card/components/CardHeader'
import { UserStatus } from '../../../../auth/AuthContext'
import { useChildBounty } from '../useChildBounty'

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
        cardHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '20px',
            marginBottom: '6px',
        },
    }),
)

interface OwnProps {
    childBounty: ChildBountyDto
    bounty: BountyDto
    disable?: boolean
    showStatus?: boolean
}

export type BountyCardProps = OwnProps

const ChildBountyCard = ({ childBounty, bounty, showStatus = true }: BountyCardProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()
    const classes = useStyles()
    const { hasCurator: childBountyHasCurator } = useChildBounty(childBounty)
    const isCuratorProposed = bounty.status === BountyStatus.CuratorProposed
    const isActive = bounty.status === BountyStatus.Active
    const isPendingPayout = bounty.status === BountyStatus.PendingPayout
    const isClaimed = bounty.status === BountyStatus.Claimed

    const bountyHasCurator = isCuratorProposed || isActive || isPendingPayout || isClaimed

    return (
        <NetworkCard>
            <CardHeader>
                <OrdinalNumber
                    prefix={`#\xa0`}
                    ordinalNumber={`${childBounty.parentIndex}\xa0-\xa0${childBounty.index}`}
                />
                {showStatus ? <ChildBountyStatusIndicator status={childBounty.status} /> : null}
            </CardHeader>

            <Divider />

            <CardDetails>
                <CardTitle title={childBounty.description} />
                <NetworkValue value={toNetworkDisplayValue(childBounty.value, network.decimals)} />
            </CardDetails>

            <Divider />

            <div className={classes.usersInfoContainer}>
                {bountyHasCurator ? <User label={t('bounty.childBounty.list.proposer')} user={bounty.curator} /> : null}
                {childBountyHasCurator ? (
                    <User
                        label={t('bounty.childBounty.list.curator')}
                        user={{ web3address: childBounty.curator, status: UserStatus.Web3Only }}
                    />
                ) : null}
            </div>
        </NetworkCard>
    )
}

export default ChildBountyCard
