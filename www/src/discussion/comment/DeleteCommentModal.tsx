import { DialogProps as MaterialDialogProps } from '@material-ui/core/Dialog/Dialog'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import QuestionModal from '../../components/modal/warning-modal/QuestionModal'
import QuestionModalButtons from '../../components/modal/warning-modal/QuestionModalButtons'
import QuestionModalError from '../../components/modal/warning-modal/QuestionModalError'
import QuestionModalTitle from '../../components/modal/warning-modal/QuestionModalTitle'
import { COMMENTS_QUERY_KEY_BASE, useDeleteComment } from '../comments.api'
import { CommentDto, DiscussionDto } from '../comments.dto'

interface OwnProps {
    comment: CommentDto
    discussion: DiscussionDto
    onClose: () => void
}

export type DeleteCommentModalProps = OwnProps & MaterialDialogProps

const DeleteCommentModal = ({ open, onClose, comment, discussion }: DeleteCommentModalProps) => {
    const { t } = useTranslation()
    const history = useHistory()

    const { mutateAsync: deleteComment, isError } = useDeleteComment()
    const queryClient = useQueryClient()

    const handleDelete = async () => {
        await deleteComment(
            { id: comment.id },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([COMMENTS_QUERY_KEY_BASE, discussion])
                },
            },
        )
    }

    return (
        <QuestionModal onClose={onClose} open={open}>
            <QuestionModalTitle title={t('discussion.deleteCommentModal.title')} />
            <QuestionModalButtons
                onClose={onClose}
                discardLabel={t('discussion.deleteCommentModal.discard')}
                onSubmit={handleDelete}
                submitLabel={t('discussion.deleteCommentModal.deleteComment')}
            />
            <QuestionModalError isError={isError} error={t('discussion.deleteCommentModal.error')} />
        </QuestionModal>
    )
}

export default DeleteCommentModal
