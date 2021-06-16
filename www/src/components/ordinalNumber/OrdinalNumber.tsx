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

interface OwnProps {
    prefix: string
    ordinalNumber: number
}

export type OrdinalNumberProps = OwnProps

const OrdinalNumber = ({ prefix, ordinalNumber }: OrdinalNumberProps) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            {prefix}
            <span className={classes.ordinalNumber}>{ordinalNumber}</span>
        </div>
    )
}

export default OrdinalNumber
