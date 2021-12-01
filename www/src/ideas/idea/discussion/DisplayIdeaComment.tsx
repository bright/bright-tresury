import React from 'react'
import { useTranslation } from 'react-i18next'
import DisplayComment from '../../../components/discussion/displayComment/DisplayComment'
import { IDEA_COMMENTS_QUERY_KEY_BASE, useDeleteIdeaComment, useEditIdeaComment } from './idea.comments.api'
import { useQueryClient } from 'react-query'
import { CommentDto } from '../../../components/discussion/comment.dto'

interface OwnProps {
    ideaId: string
    comment: CommentDto
}
export type DisplayIdeaCommentProps = OwnProps

const DisplayIdeaComment = ({ ideaId, comment }: DisplayIdeaCommentProps) => {
    const { t } = useTranslation()
    const {
        mutateAsync: deleteIdeaComment,
        isError: isDeleteIdeaCommentError,
        isLoading: deleteIsLoading,
    } = useDeleteIdeaComment()
    const {
        mutateAsync: editIdeaComment,
        isError: isEditIdeaCommentError,
        reset: editReset,
        isLoading: editIsLoading,
    } = useEditIdeaComment()
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

    const saveEditComment = async (commentContent: string) => {
        const editIdeaCommentDto = {
            content: commentContent,
        }
        await editIdeaComment(
            { ideaId, commentId: comment.id, data: editIdeaCommentDto },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([IDEA_COMMENTS_QUERY_KEY_BASE, ideaId])
                },
            },
        )
    }

    return (
        <DisplayComment
            comment={comment}
            cancelEditComment={editReset}
            saveEditComment={saveEditComment}
            editError={isEditIdeaCommentError ? t('discussion.editError') : undefined}
            deleteComment={deleteComment}
            deleteError={isDeleteIdeaCommentError ? t('discussion.deleteError') : undefined}
            isLoading={deleteIsLoading || editIsLoading}
        />
    )
}
export default DisplayIdeaComment
