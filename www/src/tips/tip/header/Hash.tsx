import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginRight: '30px',
            whiteSpace: 'nowrap',
            textOverflow: `ellipsis`,
            overflow: `hidden`,
        },
        ordinalNumber: {
            fontSize: '16px',
            fontWeight: 700,
        },
    }),
)

interface OwnProps {
    prefix: string
    hash: string
}

export type HashProps = OwnProps

const Hash = ({ prefix, hash }: HashProps) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            {prefix}
            <span className={classes.ordinalNumber}>{hash}</span>
        </div>
    )
}

export default Hash
