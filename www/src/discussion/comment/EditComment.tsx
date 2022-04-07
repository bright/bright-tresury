import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { PublicInAppUserDto } from '../../util/publicUser.dto'
import { COMMENTS_QUERY_KEY_BASE, useEditComment } from '../comments.api'
import { CommentDto, DiscussionDto } from '../comments.dto'
import CancelSendButtons from './components/CancelSendButtons'
import CommentInput from './components/input/CommentInput'

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
    people: PublicInAppUserDto[]
    onClose: () => void
}
export type EditCommentProps = OwnProps

const EditComment = ({ comment, discussion, onClose, people }: EditCommentProps) => {
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
            <CommentInput onChange={(event) => setContent(event.target.value)} value={content} people={people} />
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
