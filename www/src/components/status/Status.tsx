import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        circle: {
            borderRadius: '120px',
            width: '6px',
            height: '6px',
            marginRight: '6px',
        },
        label: {
            fontSize: '14px',
            fontWeight: 500,
        },
    }),
)

interface OwnProps {
    label: string
    color: string
}

export type StatusProps = OwnProps

const Status = ({ label, color }: StatusProps) => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <div className={classes.circle} style={{ backgroundColor: color }} />
            <div className={classes.label}>{label}</div>
        </div>
    )
}

export default Status
