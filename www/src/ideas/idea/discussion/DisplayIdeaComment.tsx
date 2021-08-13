import React from 'react'
import { useTranslation } from 'react-i18next'
import { IdeaCommentDto } from './idea.comment.dto'
import DisplayComment from '../../../components/discussion/displayComment/DisplayComment'
import { IDEA_COMMENTS_QUERY_KEY_BASE, useDeleteIdeaComment } from './idea.comments.api'
import { useQueryClient } from 'react-query'

interface OwnProps {
    ideaId: string
    comment: IdeaCommentDto
}
export type DisplayIdeaCommentProps = OwnProps

const DisplayIdeaComment = ({ ideaId, comment }: DisplayIdeaCommentProps) => {
    const { t } = useTranslation()
    const { mutateAsync: deleteIdeaComment, isError: isDeleteIdeaCommentError } = useDeleteIdeaComment()
    const queryClient = useQueryClient()
    const onDeleteClick = async () => {
        await deleteIdeaComment(
            { ideaId, commentId: comment.id },
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
            onDeleteClick={onDeleteClick}
            error={isDeleteIdeaCommentError ? t('discussion.deleteError') : undefined}
        />
    )
}
export default DisplayIdeaComment
