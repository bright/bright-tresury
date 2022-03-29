import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import useUserDisplay from './useUserDisplay'
import { PublicUserDto } from '../../util/publicUser.dto'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '16px',
            fontWeight: 600,
        },
        display: {
            margin: 0,
            color: theme.palette.text.primary,
            fontSize: '14px',
        },
        label: {
            fontSize: '12px',
            fontWeight: 700,
            marginTop: '3px',
            marginBottom: '0px',
            color: theme.palette.text.disabled,
        },
    }),
)

interface OwnProps {
    user: PublicUserDto
    ellipsis?: boolean
    label?: string
    detectYou?: boolean
}
export type UserDisplayProps = OwnProps

export const UserDisplay = ({ label, ...useUserDisplayProps }: UserDisplayProps) => {
    const classes = useStyles()
    const { display } = useUserDisplay(useUserDisplayProps)

    return (
        <div className={classes.root}>
            <p className={classes.display}>{display}</p>
            {label ? <p className={classes.label}>{label}</p> : null}
        </div>
    )
}
