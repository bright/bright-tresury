import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useNetworks } from '../../networks/useNetworks'
import { breakpoints } from '../../theme/theme'
import { useTranslation } from 'react-i18next'
import Amount from '../amount/Amount'
import { calculateBondValue } from '../../networks/bondUtil'

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
    rewardValue: number
    bondValue?: number
}
export type NetworkRewardDepositProps = OwnProps
const NetworkRewardDeposit = ({ rewardValue, bondValue }: NetworkRewardDepositProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { network } = useNetworks()

    let resolvedBondValue
    if (!bondValue) {
        resolvedBondValue = rewardValue
            ? calculateBondValue(rewardValue, network.bond.percentage, network.bond.minValue)
            : 0
    } else {
        resolvedBondValue = bondValue
    }

    return (
        <div className={classes.root}>
            <div className={classes.reward}>
                <Amount amount={rewardValue} currency={network.currency} label={t('idea.content.info.reward')} />
            </div>
            <div className={classes.deposit}>
                <Amount amount={resolvedBondValue} currency={network.currency} label={t('idea.content.info.deposit')} />
            </div>
        </div>
    )
}
export default NetworkRewardDeposit
