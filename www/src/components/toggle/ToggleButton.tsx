import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { ToggleButton as MaterialToggleButton } from '@material-ui/lab'
import { NavLink } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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

const useToggleButtonClasses = makeStyles(() =>
    createStyles({
        root: {
            borderRadius: 0,
            fontWeight: 'bold',
            textTransform: 'none',
            padding: `11px 34px`,
        },
    }),
)

export interface ToggleEntry {
    label: string
    path: string
}

export interface ToggleButtonProps {
    entry: ToggleEntry
}

const ToggleButton = ({ entry }: ToggleButtonProps) => {
    const classes = useStyles()
    const toggleButtonClasses = useToggleButtonClasses()

    return (
        <NavLink to={entry.path} className={classes.inactive} activeClassName={classes.active} replace={true}>
            <MaterialToggleButton classes={toggleButtonClasses} value={entry.label}>
                {entry.label}
            </MaterialToggleButton>
        </NavLink>
    )
}

export default ToggleButton
