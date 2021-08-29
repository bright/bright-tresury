import thumbsUpIcon from '../../../assets/thumbs_down.svg'
import thumbsDownIcon from '../../../assets/thumbs_down.svg'
import linkIcon from '../../../assets/link.svg'
import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import SmallVerticalDivider from '../../smallHorizontalDivider/SmallVerticalDivider'
import { IdeaCommentDto } from '../../../ideas/idea/discussion/idea.comment.dto'
import CommentAuthorImage from '../commentAuthorImage/CommentAuthorImage'
import CommentOptionsMenu from '../../../ideas/idea/discussion/CommentOptionsMenu'
import Error from '../../error/Error'
import { useAuth } from '../../../auth/AuthContext'
import { Nil } from '../../../util/types'
import EditComment from '../editComment/EditComment'
import Author from './Author'
import CommentAge from './CommentAge'
import CommentContent from './CommentContent'

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

        thumb: {
            paddingTop: '8px',
            paddingRight: '8px',
            color: theme.palette.text.disabled,
            margin: '0px 6px',
        },
        rotate180: {
            transform: 'rotate(180deg)',
        },
        link: {
            paddingTop: '8px',
            margin: '0px 6px',
        },

        grayDivider: {
            color: theme.palette.text.disabled,
        },
        error: {
            fontSize: '12px',
            textAlign: 'right',
            margin: 0,
            marginTop: '6px',
        },
    }),
)

interface OwnProps {
    comment: IdeaCommentDto
    saveEditComment: (content: string) => Promise<void>
    cancelEditComment: () => void
    deleteComment: () => Promise<void>
    error?: Nil<string>
}
export type DisplayCommentProps = OwnProps

const DisplayComment = ({ comment, deleteComment, saveEditComment, cancelEditComment, error }: DisplayCommentProps) => {
    const { id, author, createdAt, updatedAt, content } = comment
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
                    <CommentAuthorImage author={author} />
                    <Author author={author} />
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
                <EditComment onSendClick={onSendClick} onCancelClick={onCancelClick} value={content} />
            ) : (
                <CommentContent content={content} />
            )}
            {error ? <Error className={classes.error} text={error} /> : <div style={{ height: '24px' }} />}
        </div>
    )
}
export default DisplayComment
