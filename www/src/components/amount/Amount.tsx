import { createStyles, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { PropsWithChildren } from 'react'
import { breakpoints } from '../../theme/theme'
import { NetworkDisplayValue } from '../../util/types'
import { ClassesProps } from '../props/className.props'

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
            whiteSpace: 'nowrap',
        },
    }),
)

interface OwnProps {
    amount: NetworkDisplayValue
    currency: string
    label?: string
}

export type AmountClassKeys = 'root' | 'amount' | 'label'

export type AmountProps = PropsWithChildren<OwnProps> & ClassesProps<AmountClassKeys>

const Amount = ({ amount, currency, label, classes: propsClasses, ...props }: AmountProps) => {
    const classes = useStyles()

    return (
        <div {...props} className={clsx(classes.root, propsClasses?.root)}>
            <div className={clsx(classes.amount, propsClasses?.amount)}>{`${amount} ${currency}`}</div>
            {label && <div className={clsx(classes.label, propsClasses?.label)}>{label}</div>}
        </div>
    )
}
export default Amount
