import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core'
import { ClassNameProps } from '../props/className.props'
import clsx from 'clsx'

const useStyles = makeStyles((theme) =>
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
        sublabel: {
            fontSize: '12px',
            fontWeight: 500,
            color: theme.palette.text.disabled,
        },
    }),
)

interface OwnProps {
    label: string
    sublabel?: string
    color: string
}

export type StatusProps = OwnProps & ClassNameProps

const Status = ({ label, sublabel, color, className }: StatusProps) => {
    const classes = useStyles()
    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.circle} style={{ backgroundColor: color }} />
            <div className={classes.label}>
                {label} {sublabel ? <span className={classes.sublabel}>{sublabel}</span> : null}
            </div>
        </div>
    )
}

export default Status
