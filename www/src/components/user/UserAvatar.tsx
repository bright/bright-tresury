import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import { ClassNameProps } from '../props/className.props'
import { getInitials } from './initials.helpers'
import Identicon from '../identicon/Identicon'
import { UserStatus } from '../../auth/AuthContext'
import userDeleted from '../../assets/user-deleted.svg'
import { breakpoints } from '../../theme/theme'
import { PublicUserDto } from '../../util/publicUser.dto'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        initials: {
            borderRadius: '8px',
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            fontSize: '20px',
            verticalAlign: 'middle',
            textAlign: 'center',
            width: '28px',
        },
        deleted: {
            width: '32px',
            height: '32px',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                width: '42px',
                height: '42px',
            },
        },
    }),
)

interface OwnProps {
    user: PublicUserDto
    size?: number
}

export type UserAvatarProps = OwnProps & ClassNameProps

const UserAvatar = ({ user, size, className }: UserAvatarProps) => {
    const classes = useStyles()
    const avatar = useMemo(() => {
        if (user.status === UserStatus.Deleted)
            return <img className={classes.deleted} src={userDeleted} alt={'userDeletedImage'} />
        else if (user.web3address) return <Identicon address={user.web3address} size={size} />
        else return <div className={classes.initials}>{getInitials(user.username ?? user.userId ?? '')}</div>
    }, [user, size])

    return <div className={className}>{avatar}</div>
}

export default UserAvatar
