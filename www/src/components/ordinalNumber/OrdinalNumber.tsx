import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            paddingRight: '10px',
            whiteSpace: 'nowrap',
        },
        ordinalNumber: {
            fontSize: '16px',
            fontWeight: 700,
        },
    }),
)

interface Props {
    prefix: string
    ordinalNumber: number
}

export const OrdinalNumber = ({ prefix, ordinalNumber }: Props) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            {prefix}
            <span className={classes.ordinalNumber}>{ordinalNumber}</span>
        </div>
    )
}
