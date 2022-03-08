import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { COMMENTS_QUERY_KEY_BASE, useEditComment } from '../comments.api'
import { DiscussionDto, CommentDto } from '../comments.dto'
import CancelSendButtons from './components/CancelSendButtons'
import CommentTextarea from './components/CommentTextArea'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        editCommentRow: {
            backgroundColor: theme.palette.background.default,
            borderRadius: '8px',
        },
    }),
)

interface OwnProps {
    comment: CommentDto
    discussion: DiscussionDto
    onClose: () => void
}
export type EditCommentProps = OwnProps

const EditComment = ({ comment, discussion, onClose }: EditCommentProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const [content, setContent] = useState(comment.content)
    const { mutateAsync, isError, isLoading } = useEditComment()
    const queryClient = useQueryClient()

    const onSendClick = async () => {
        await mutateAsync(
            { id: comment.id, content },
            {
                onSuccess: async () => {
                    setContent('')
                    await queryClient.refetchQueries([COMMENTS_QUERY_KEY_BASE, discussion])
                    onClose()
                },
            },
        )
    }

    return (
        <div className={clsx(classes.editCommentRow)}>
            <CommentTextarea onChange={(event) => setContent(event.target.value)} value={content} />
            <CancelSendButtons
                onCancelClick={onClose}
                onSendClick={onSendClick}
                error={isError ? t('discussion.sendCommentError') : null}
                isLoading={isLoading}
            />
        </div>
    )
}
export default EditComment
