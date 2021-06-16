import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { ToggleButton as MaterialToggleButton } from '@material-ui/lab'
import { NavLink } from 'react-router-dom'
import { Location } from 'history'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderRadius: 0,
            fontWeight: 'bold',
            textTransform: 'none',
            padding: `14px 34px`,
        },
        inactive: {
            width: '100%',
            textDecoration: 'none',
            '& > *': {
                width: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                color: theme.palette.primary.main,
                background: theme.palette.background.default,
            },
        },
        active: {
            '& > *': {
                color: `${theme.palette.background.default} !important`,
                background: `${theme.palette.primary.main} !important`,
                boxShadow: `0px 0px 5px rgba(0, 0, 0, 0.5)`,
            },
        },
    }),
)

export interface ToggleEntry {
    label: string
    path: string
}

interface OwnProps {
    entry: ToggleEntry
    isActive: (entry: ToggleEntry, location: Location) => boolean
}

export type SingleToggleButtonProps = OwnProps

const SingleToggleButton = ({ entry, isActive }: SingleToggleButtonProps) => {
    const classes = useStyles()
    return (
        <NavLink
            to={entry.path}
            isActive={(match, location: Location) => isActive(entry, location)}
            className={classes.inactive}
            activeClassName={classes.active}
        >
            <MaterialToggleButton classes={classes} value={entry.label}>
                {entry.label}
            </MaterialToggleButton>
        </NavLink>
    )
}

export default SingleToggleButton
