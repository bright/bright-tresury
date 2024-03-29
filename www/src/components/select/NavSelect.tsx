import React from 'react'
import Select, { SelectProps } from './Select'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core'
import { NavLink } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        link: {
            textDecoration: 'none',
            width: '100%',
            color: theme.palette.text.primary,
        },
    }),
)

export interface NavSelectOption {
    label: string
    path: string
    isDefault?: boolean
}

export type NavSelectProps = SelectProps<NavSelectOption>

const NavSelect = ({ ...props }: NavSelectProps) => {
    const classes = useStyles()
    return (
        <Select
            {...props}
            renderOption={(option: NavSelectOption) => (
                <NavLink className={classes.link} to={option.path}>
                    {option.label}
                </NavLink>
            )}
        />
    )
}

export default NavSelect
