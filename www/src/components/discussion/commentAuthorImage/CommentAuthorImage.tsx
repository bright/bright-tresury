import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { AuthorDto } from '../../../util/author.dto'
import Avatar from '../../avatar/Avatar'
import Identicon from '../../identicon/Identicon'
import clsx from 'clsx'
import { UserStatus } from '../../../auth/AuthContext'
import userDeletedAvatar from '../../../assets/user-deleted.svg'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '26px',
            lineHeight: '26px',
            width: '26px',
            borderRadius: '6px',
        },
        identicon: {
            backgroundColor: '#eeeeee',
        },
        avatar: {
            fontSize: '18px',
            backgroundColor: theme.palette.background.default,
            border: '1px solid',
            borderColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
        },
        centered: {
            display: 'flex',
            alignItems: 'center',
        },
    }),
)

interface OwnProps {
    author: AuthorDto
}
export type CommentAuthorImageProps = OwnProps

const CommentAuthorImage = ({ author }: CommentAuthorImageProps) => {
    const { username, web3address, status } = author
    const classes = useStyles()
    return (
        <div className={classes.centered}>
            {status === UserStatus.Deleted ? (
                <img className={clsx(classes.root, classes.avatar)} src={userDeletedAvatar}></img>
            ) : status === UserStatus.EmailPasswordEnabled ? (
                <Avatar username={username} className={clsx(classes.root, classes.avatar)} />
            ) : (
                <div className={clsx(classes.root, classes.identicon)}>
                    <Identicon address={web3address!} size={26} />
                </div>
            )}
        </div>
    )
}
export default CommentAuthorImage
