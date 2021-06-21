import React, { PropsWithChildren } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles, Theme } from '@material-ui/core'
import { formatNumber } from '../../util/numberUtil'
import { breakpoints } from '../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.primary.light,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8px',
            padding: '16px 20px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                flexDirection: 'row',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                flexDirection: 'column',
            },
        },
        amount: {
            fontSize: '18px',
            fontWeight: 700,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontSize: '16px',
            },
            whiteSpace: 'nowrap',
        },
        label: {
            fontSize: '14px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginLeft: '12px',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontSize: '12px',
                marginLeft: 0,
            },
        },
    }),
)

interface OwnProps {
    amount: number
    currency: string
    label?: string
}

export type AmountProps = PropsWithChildren<OwnProps>

const Amount = ({ amount, currency, label, ...props }: AmountProps) => {
    const classes = useStyles()
    return (
        <div {...props} className={classes.root}>
            <div className={classes.amount}>
                {formatNumber(Number(amount))} {currency}
            </div>
            {label && <div className={classes.label}>{label}</div>}
        </div>
    )
}
export default Amount
