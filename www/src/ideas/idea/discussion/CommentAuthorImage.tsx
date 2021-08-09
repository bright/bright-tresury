import React from 'react'
import Avatar from '../../../components/avatar/Avatar'
import clsx from 'clsx'
import Identicon from '../../../components/identicon/Identicon'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { CommentAuthorDto } from './idea.comment.dto'

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
    }),
)

interface OwnProps {
    author: CommentAuthorDto
}
export type CommentAuthorImageProps = OwnProps

const CommentAuthorImage = ({ author }: CommentAuthorImageProps) => {
    const { username, web3address, isEmailPasswordEnabled } = author
    const classes = useStyles()
    return (
        <div>
            {isEmailPasswordEnabled ? (
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
