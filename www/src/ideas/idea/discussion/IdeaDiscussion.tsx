import React from 'react'
import DiscussionContainer from './DiscussionContainer'
import DiscussionHeader from './DiscussionHeader'
import DiscussionCommentsContainer from './DiscussionCommentsContainer'
import EnterCommentComponent from './EnterCommentComponent'
import CommentComponent from './CommentComponent'
import LoadingWrapper from '../../../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { IDEA_COMMENTS_QUERY_KEY_BASE, useCreateIdeaComment, useGetIdeaComments } from './idea.comments.api'
import { useAuth } from '../../../auth/AuthContext'
import { CreateIdeaCommentDto } from './IdeaComment.dto'
import { IDEA_MILESTONES_QUERY_KEY_BASE } from '../milestones/idea.milestones.api'
import { useQueryClient } from 'react-query'

interface OwnProps {
    ideaId: string
}
export type IdeaDiscussionProps = OwnProps

export const IdeaDiscussion = ({ ideaId }: IdeaDiscussionProps) => {
    const { status, data: ideaComments } = useGetIdeaComments(ideaId)
    const { isUserSignedInAndVerified: canComment, user } = useAuth()
    const { t } = useTranslation()
    const { mutateAsync } = useCreateIdeaComment()
    const queryClient = useQueryClient()
    const onSendClick = async (commentContent: string) => {
        if (!canComment) {
            // user is not allowed to post comments (possible not logged in or not verified)
            return
        }
        const ideaCommentDto = {
            content: commentContent,
        } as CreateIdeaCommentDto
        await mutateAsync(
            { ideaId: ideaId, data: ideaCommentDto },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([IDEA_COMMENTS_QUERY_KEY_BASE, ideaId])
                },
            },
        )
    }

    return (
        <DiscussionContainer>
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingIdea')}
                loadingText={t('loading.idea')}
            >
                <DiscussionHeader />
                <DiscussionCommentsContainer>
                    {canComment ? <EnterCommentComponent onSendClick={onSendClick} /> : null}
                    {ideaComments
                        ? ideaComments.map((comment, index) => <CommentComponent key={index} comment={comment} />)
                        : null}
                </DiscussionCommentsContainer>
            </LoadingWrapper>
        </DiscussionContainer>
    )
}
