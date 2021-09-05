import React from 'react'
import DiscussionContainer from '../../../components/discussion/discussionContainer/DiscussionContainer'
import DiscussionHeader from '../../../components/discussion/discussionHeader/DiscussionHeader'
import DiscussionCommentsContainer from '../../../components/discussion/discussionCommentsContainer/DiscussionCommentsContainer'
import LoadingWrapper from '../../../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { useGetIdeaComments } from './idea.comments.api'
import { useAuth } from '../../../auth/AuthContext'
import DisplayIdeaComment from './DisplayIdeaComment'
import NoComments from '../../../components/discussion/noComments/NoComments'
import EnterIdeaComment from './EnterIdeaComment'
import { CommentDto } from '../../../components/discussion/comment.dto'

interface OwnProps {
    ideaId: string
}
export type IdeaDiscussionProps = OwnProps

const IdeaDiscussion = ({ ideaId }: IdeaDiscussionProps) => {
    const { status, data: ideaComments } = useGetIdeaComments(ideaId)
    const { isUserSignedInAndVerified: canComment } = useAuth()
    const { t } = useTranslation()

    const renderIdeaComment = (comment: CommentDto) => (
        <DisplayIdeaComment key={comment.id} comment={comment} ideaId={ideaId} />
    )

    return (
        <DiscussionContainer>
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingIdeaComments')}
                loadingText={t('loading.ideaComments')}
            >
                <DiscussionHeader />
                <DiscussionCommentsContainer>
                    {canComment ? <EnterIdeaComment ideaId={ideaId} /> : null}
                    {ideaComments?.length ? ideaComments.map(renderIdeaComment) : <NoComments />}
                </DiscussionCommentsContainer>
            </LoadingWrapper>
        </DiscussionContainer>
    )
}
export default IdeaDiscussion
