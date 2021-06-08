import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import {getInitials} from "./initials.helpers";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '46px',
            lineHeight: '46px',
            width: '46px',
            borderRadius: '8px',
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            fontSize: '22px',
            verticalAlign: 'center',
            textAlign: 'center',
        },
    }),
)

export interface AvatarProps {
    username?: string
    email?: string
}

const Avatar = ({username, email}: AvatarProps) => {
    const classes = useStyles()
    const name = username ?? email
    const initials = getInitials(name)
    return <div className={classes.root}>
        {initials}
    </div>
}

export default Avatar
