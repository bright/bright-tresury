import React from 'react'
import DiscussionContainer from './DiscussionContainer'
import DiscussionHeader from './DiscussionHeader'
import DiscussionCommentsContainer from './DiscussionCommentsContainer'
import LoadingWrapper from '../../../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { useGetIdeaComments } from './idea.comments.api'
import { useAuth } from '../../../auth/AuthContext'
import { IdeaCommentDto } from './idea.comment.dto'
import DisplayIdeaComment from './DisplayIdeaComment'
import NoComments from '../../../components/discussion/noComments/NoComments'
import EnterIdeaComment from './EnterIdeaComment'

interface OwnProps {
    ideaId: string
}
export type IdeaDiscussionProps = OwnProps

const IdeaDiscussion = ({ ideaId }: IdeaDiscussionProps) => {
    const { status, data: ideaComments } = useGetIdeaComments(ideaId)
    const { isUserSignedInAndVerified: canComment } = useAuth()
    const { t } = useTranslation()

    const renderIdeaComment = (comment: IdeaCommentDto) => (
        <DisplayIdeaComment key={comment.id} comment={comment} ideaId={ideaId} />
    )
    return (
        <DiscussionContainer>
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingIdea')}
                loadingText={t('loading.idea')}
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
