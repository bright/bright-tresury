import React from 'react'
import { formatNumber } from '../../util/numberUtil'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'
import config from '../../config/index'

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

interface Props {
    value: number
}

export const NetworkValue: React.FC<Props> = ({ value }) => {
    const classes = useStyles()
    return (
        <p className={classes.root}>
            {formatNumber(value)} {config.NETWORK_CURRENCY}
        </p>
    )
}
