import { createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import Amount, { AmountProps } from './Amount'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: '#7B7B7B43',
            paddingTop: '8px',
            paddingBottom: '8px',
            paddingLeft: '12px',
            paddingRight: '12px',
        },
        amount: {
            fontSize: '16px',
        },
    }),
)

export type StyledSmallAmountProps = AmountProps

const StyledSmallAmount = (props: StyledSmallAmountProps) => {
    const classes = useStyles()
    return <Amount {...props} classes={classes} />
}
export default StyledSmallAmount
