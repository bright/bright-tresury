import React from 'react'
import DiscussionContainer from '../../../components/discussion/discussionContainer/DiscussionContainer'
import DiscussionHeader from '../../../components/discussion/discussionHeader/DiscussionHeader'
import DiscussionCommentsContainer from '../../../components/discussion/discussionCommentsContainer/DiscussionCommentsContainer'
import LoadingWrapper from '../../../components/loading/LoadingWrapper'
import { IdeaDto, IdeaStatus } from '../../ideas.dto'
import { useGetIdeaComments } from './idea.comments.api'
import { useAuth } from '../../../auth/AuthContext'
import { useTranslation } from 'react-i18next'
import { CommentDto } from '../../../components/discussion/comment.dto'
import DisplayIdeaComment from './DisplayIdeaComment'
import EnterIdeaComment from './EnterIdeaComment'
import NoComments from '../../../components/discussion/noComments/NoComments'
import AlreadyTurnedIntoProposal from './AlreadyTurnedIntoProposal'

interface OwnProps {
    idea: IdeaDto
}
export type PublicIdeaDiscussionProps = OwnProps

const PublicIdeaDiscussion = ({ idea }: PublicIdeaDiscussionProps) => {
    const { status, data: ideaComments } = useGetIdeaComments(idea.id)
    const { isUserSignedInAndVerified: canComment } = useAuth()
    const { t } = useTranslation()

    const renderIdeaComment = (comment: CommentDto) => (
        <DisplayIdeaComment key={comment.id} comment={comment} ideaId={idea.id} />
    )

    return (
        <DiscussionContainer>
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingIdeaComments')}
                loadingText={t('loading.ideaComments')}
            >
                {idea.status === IdeaStatus.TurnedIntoProposal ? (
                    <AlreadyTurnedIntoProposal proposalIndex={idea.currentNetwork.blockchainProposalId!} />
                ) : null}
                <DiscussionHeader />
                <DiscussionCommentsContainer>
                    {canComment ? <EnterIdeaComment ideaId={idea.id} /> : null}
                    {ideaComments?.length ? ideaComments.map(renderIdeaComment) : <NoComments />}
                </DiscussionCommentsContainer>
            </LoadingWrapper>
        </DiscussionContainer>
    )
}
export default PublicIdeaDiscussion
