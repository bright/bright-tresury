import React, { useState } from 'react'
import SmallVerticalDivider from '../../smallHorizontalDivider/SmallVerticalDivider'
import CommentOptionsMenu from '../commentOptionsMenu/CommentOptionsMenu'
import Error from '../../error/Error'
import { useAuth, UserStatus } from '../../../auth/AuthContext'
import { Nil } from '../../../util/types'
import EditComment from '../editComment/EditComment'
import CommentAge from './CommentAge'
import CommentContent from './CommentContent'
import { CommentDto } from '../comment.dto'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import Avatar from '../../avatar/Avatar'
import StyledAvatar from './StyledAvatar'
import { useTranslation } from 'react-i18next'
import userDeleted from '../../../assets/user-deleted.svg'
import { breakpoints } from '../../../theme/theme'
import Author from '../../author/Author'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '20px',
            padding: '16px',
            backgroundColor: theme.palette.background.default,
            border: 'none',
            borderRadius: '8px',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        headerLeft: {
            flexGrow: 2,
            display: 'flex',
        },
        headerRight: {
            display: 'flex',
        },
        grayDivider: {
            color: theme.palette.text.disabled,
            paddingTop: '6px',
            height: '100%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                paddingTop: '12px',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingTop: '6px',
            },
        },
        error: {
            fontSize: '12px',
            textAlign: 'right',
            margin: 0,
            marginTop: '6px',
        },
        userContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            top: '-5px',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                whiteSpace: 'nowrap',
                position: 'relative',
            },
        },
        userName: {
            marginLeft: '20px',
        },
        avatar: {
            height: '32px',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                height: '42px',
                bottom: '6px',
            },
        },
    }),
)

interface OwnProps {
    comment: CommentDto
    isLoading: boolean

    saveEditComment: (content: string) => Promise<void>
    cancelEditComment: () => void
    editError?: Nil<string>

    deleteComment: () => Promise<void>
    deleteError?: Nil<string>
}
export type DisplayCommentProps = OwnProps

const DisplayComment = ({
    comment,
    saveEditComment,
    cancelEditComment,
    editError,
    deleteComment,
    deleteError,
    isLoading,
}: DisplayCommentProps) => {
    const { author, createdAt, updatedAt, content } = comment
    const classes = useStyles()
    const { t } = useTranslation()
    const { user } = useAuth()
    const isAuthor = user?.id && author.userId && user?.id === author.userId
    const [editMode, setEditMode] = useState(false)
    const enableEditMode = () => setEditMode(true)
    const disableEditMode = () => setEditMode(false)
    const onSendClick = async (content: string) => {
        await saveEditComment(content)
        return disableEditMode()
    }
    const onCancelClick = () => {
        cancelEditComment()
        disableEditMode()
    }

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.headerLeft}>
                    <div className={classes.userContainer}>
                        {author.status === UserStatus.Deleted ? (
                            <>
                                <img className={classes.avatar} src={userDeleted} alt={'userDeletedimage'} />
                                <div className={classes.userName}>{t('discussion.accountDeleted')}</div>
                            </>
                        ) : (
                            <>
                                <StyledAvatar>
                                    <Avatar username={author.username} web3Address={author.web3address} />
                                </StyledAvatar>
                                <Author author={author} />
                            </>
                        )}
                    </div>
                    <SmallVerticalDivider className={classes.grayDivider} />
                    <CommentAge createdAt={createdAt} updatedAt={updatedAt} />
                </div>
                <div className={classes.headerRight}>
                    {isAuthor ? (
                        <CommentOptionsMenu onEditClick={enableEditMode} onDeleteClick={deleteComment} />
                    ) : null}
                </div>
            </div>
            {editMode ? (
                <EditComment
                    onSendClick={onSendClick}
                    onCancelClick={onCancelClick}
                    value={content}
                    error={editError}
                    isLoading={isLoading}
                />
            ) : (
                <CommentContent content={content} />
            )}
            {deleteError ? <Error className={classes.error} text={deleteError} /> : <div style={{ height: '24px' }} />}
        </div>
    )
}
export default DisplayComment
