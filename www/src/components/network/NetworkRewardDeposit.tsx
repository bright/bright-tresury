import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useNetworks } from '../../networks/useNetworks'
import { breakpoints } from '../../theme/theme'
import { useTranslation } from 'react-i18next'
import Amount from '../amount/Amount'
import { calculateBondValue } from '../../ideas/bondUtil'
import { NetworkPlanckValue, Nil } from '../../util/types'
import { toNetworkDisplayValue } from '../../util/quota.util'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
        },
        reward: {
            flex: 1,
        },
        deposit: {
            flex: 1,
            marginLeft: '32px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginLeft: '18px',
            },
        },
    }),
)

interface OwnProps {
    rewardValue: NetworkPlanckValue
    bondValue?: Nil<NetworkPlanckValue>
}
export type NetworkRewardDepositProps = OwnProps
const NetworkRewardDeposit = ({ rewardValue, bondValue }: NetworkRewardDepositProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { network } = useNetworks()

    let resolvedBondValue = bondValue
    if (!resolvedBondValue) {
        resolvedBondValue = rewardValue
            ? calculateBondValue(rewardValue, network.bond.percentage, network.bond.minValue)
            : ('0' as NetworkPlanckValue)
    }

    return (
        <div className={classes.root}>
            <div className={classes.reward}>
                <Amount
                    amount={toNetworkDisplayValue(rewardValue, network.decimals)}
                    currency={network.currency}
                    label={t('idea.content.info.reward')}
                />
            </div>
            <div className={classes.deposit}>
                <Amount
                    amount={toNetworkDisplayValue(resolvedBondValue, network.decimals)}
                    currency={network.currency}
                    label={t('idea.content.info.deposit')}
                />
            </div>
        </div>
    )
}
export default NetworkRewardDeposit
