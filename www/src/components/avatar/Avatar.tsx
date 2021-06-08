import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from 'react';
import {ClassNameProps} from "../props/className.props";
import {getInitials} from "./initials.helpers";
import clsx from "clsx";

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

interface OwnProps {
    username?: string
    email?: string
}

export type AvatarProps = OwnProps & ClassNameProps

const Avatar = ({username, email, className}: AvatarProps) => {
    const classes = useStyles()
    const name = username ?? email
    const initials = getInitials(name)
    return <div className={clsx(classes.root, className)}>
        {initials}
    </div>
}

export default Avatar
