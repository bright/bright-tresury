import React from 'react'
import { useTranslation } from 'react-i18next'
import { IdeaCommentDto, UpdateIdeaCommentDto } from './idea.comment.dto'
import DisplayComment from '../../../components/discussion/displayComment/DisplayComment'
import { IDEA_COMMENTS_QUERY_KEY_BASE, useDeleteIdeaComment, useUpdateIdeaComment } from './idea.comments.api'
import { useQueryClient } from 'react-query'

interface OwnProps {
    ideaId: string
    comment: IdeaCommentDto
}
export type DisplayIdeaCommentProps = OwnProps

const DisplayIdeaComment = ({ ideaId, comment }: DisplayIdeaCommentProps) => {
    const { t } = useTranslation()
    const { mutateAsync: deleteIdeaComment, isError: isDeleteIdeaCommentError } = useDeleteIdeaComment()
    const {
        mutateAsync: updateIdeaComment,
        isError: isUpdateIdeaCommentError,
        reset: updateReset,
    } = useUpdateIdeaComment()
    const queryClient = useQueryClient()
    const deleteComment = async () => {
        await deleteIdeaComment(
            { ideaId, commentId: comment.id },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([IDEA_COMMENTS_QUERY_KEY_BASE, ideaId])
                },
            },
        )
    }

    const updateComment = async (commentContent: string) => {
        const updateIdeaCommentDto = { content: commentContent }
        await updateIdeaComment(
            { ideaId, commentId: comment.id, data: updateIdeaCommentDto },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([IDEA_COMMENTS_QUERY_KEY_BASE, ideaId])
                },
            },
        )
    }
    const deleteError = isDeleteIdeaCommentError ? t('discussion.deleteError') : undefined
    const updateError = isUpdateIdeaCommentError ? t('discussion.editError') : undefined
    const error = deleteError ?? updateError
    return (
        <DisplayComment
            comment={comment}
            cancelEditComment={updateReset}
            saveEditComment={updateComment}
            deleteComment={deleteComment}
            error={error}
        />
    )
}
export default DisplayIdeaComment
