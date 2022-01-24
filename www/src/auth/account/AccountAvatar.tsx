import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'

import clsx from 'clsx'
import { Nil } from '../../util/types'
import { getInitials } from '../../components/avatar/initials.helpers'
import { ClassNameProps } from '../../components/props/className.props'

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
    username?: Nil<string>
    email?: Nil<string>
}

export type AvatarProps = OwnProps & ClassNameProps

const AccountAvatar = ({ username, email, className }: AvatarProps) => {
    const classes = useStyles()
    const name = username ?? email
    const initials = getInitials(name)
    return <div className={clsx(classes.root, className)}>{initials}</div>
}

export default AccountAvatar
