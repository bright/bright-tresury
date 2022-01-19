import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useNetworks } from '../../networks/useNetworks'
import { breakpoints } from '../../theme/theme'
import Amount from '../amount/Amount'
import { NetworkPlanckValue } from '../../util/types'
import { toNetworkDisplayValue } from '../../util/quota.util'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            gap: '32px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                gap: '18px',
            },
            flexWrap: 'wrap',
        },
        item: {
            flex: 1,
        },
    }),
)

interface OwnProps {
    values: {
        label: string
        value: NetworkPlanckValue
    }[]
}

export type NetworkRewardDepositProps = OwnProps
const NetworkRewardDeposit = ({ values }: NetworkRewardDepositProps) => {
    const classes = useStyles()
    const { network } = useNetworks()

    return (
        <div className={classes.root}>
            {values.map((value) => (
                <div className={classes.item}>
                    <Amount
                        amount={toNetworkDisplayValue(value.value, network.decimals)}
                        currency={network.currency}
                        label={value.label}
                    />
                </div>
            ))}
        </div>
    )
}
export default NetworkRewardDeposit
