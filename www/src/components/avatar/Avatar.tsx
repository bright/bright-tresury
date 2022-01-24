import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { ClassNameProps } from '../props/className.props'
import { getInitials } from './initials.helpers'
import clsx from 'clsx'
import { Nil } from '../../util/types'
import { WithWidthProps } from '@material-ui/core/withWidth/withWidth'
import Identicon from '../identicon/Identicon'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
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
    web3Address?: Nil<string>
    size?: number
}

export type AvatarProps = OwnProps & ClassNameProps

const Avatar = ({ web3Address, email, className, username, size }: AvatarProps) => {
    const classes = useStyles()
    const name = username ?? email
    const initials = getInitials(name)
    return (
        <div className={clsx(className)}>
            {web3Address ? (
                <Identicon address={web3Address} size={size} />
            ) : (
                <div className={classes.root}>{initials}</div>
            )}
        </div>
    )
}

export default Avatar
