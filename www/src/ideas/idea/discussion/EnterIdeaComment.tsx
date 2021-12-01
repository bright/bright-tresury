import React from 'react'
import { useTranslation } from 'react-i18next'
import EnterComment from '../../../components/discussion/enterComment/EnterComment'
import { IDEA_COMMENTS_QUERY_KEY_BASE, useCreateIdeaComment } from './idea.comments.api'
import { useQueryClient } from 'react-query'
import { CreateCommentDto } from '../../../components/discussion/comment.dto'

interface OwnProps {
    ideaId: string
}
export type EnterIdeaCommentProps = OwnProps

const EnterIdeaComment = ({ ideaId }: EnterIdeaCommentProps) => {
    const { t } = useTranslation()
    const { mutateAsync: createIdeaComment, isError, reset, isLoading } = useCreateIdeaComment()

    const queryClient = useQueryClient()
    const onSendClick = async (commentContent: string) => {
        const ideaCommentDto = {
            content: commentContent,
        } as CreateCommentDto

        await createIdeaComment(
            { ideaId: ideaId, data: ideaCommentDto },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([IDEA_COMMENTS_QUERY_KEY_BASE, ideaId])
                },
            },
        )
    }

    return (
        <EnterComment
            onSendClick={onSendClick}
            onCancelClick={reset}
            error={isError ? t('discussion.sendCommentError') : undefined}
            isLoading={isLoading}
        />
    )
}
export default EnterIdeaComment
