import React from 'react'
import { useNetworks } from '../../networks/useNetworks'
import { formatNumber } from '../../util/numberUtil'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: '#E6F0FD',
            borderRadius: '3px',
            fontSize: '1em',
            marginTop: '16px',
            display: 'block',
            position: 'relative',
            [theme.breakpoints.up(breakpoints.tablet)]: {
                marginLeft: '4em',
            },
            fontWeight: 500,
            padding: '3px',
        },
    }),
)

interface OwnProps {
    value: number
}

export type NetworkValueProps = OwnProps

const NetworkValue = ({ value }: NetworkValueProps) => {
    const classes = useStyles()
    const { network } = useNetworks()
    return (
        <p className={classes.root}>
            {formatNumber(value)} {network.currency}
        </p>
    )
}
export default NetworkValue
