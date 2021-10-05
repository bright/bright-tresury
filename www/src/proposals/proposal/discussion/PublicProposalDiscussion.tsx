import React from 'react'
import { useAuth } from '../../../auth/AuthContext'
import { useTranslation } from 'react-i18next'
import DiscussionContainer from '../../../components/discussion/discussionContainer/DiscussionContainer'
import LoadingWrapper from '../../../components/loading/LoadingWrapper'
import DiscussionHeader from '../../../components/discussion/discussionHeader/DiscussionHeader'
import DiscussionCommentsContainer from '../../../components/discussion/discussionCommentsContainer/DiscussionCommentsContainer'
import NoComments from '../../../components/discussion/noComments/NoComments'
import { useGetProposalComments } from './proposal.comments.api'
import { CommentDto } from '../../../components/discussion/comment.dto'
import DisplayProposalComment from './DisplayProposalComment'
import EnterProposalComment from './EnterProposalComment'
import { useNetworks } from '../../../networks/useNetworks'

interface OwnProps {
    proposalIndex: number
}
export type PublicProposalDiscussionProps = OwnProps
const PublicProposalDiscussion = ({ proposalIndex }: PublicProposalDiscussionProps) => {
    const { network } = useNetworks()
    const { status, data: proposalComments } = useGetProposalComments(proposalIndex, network.id)
    const { isUserSignedInAndVerified: canComment } = useAuth()
    const { t } = useTranslation()

    const renderProposalComment = (comment: CommentDto) => (
        <DisplayProposalComment key={comment.id} comment={comment} proposalIndex={proposalIndex} />
    )

    return (
        <DiscussionContainer>
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingProposalComments')}
                loadingText={t('loading.proposalComments')}
            >
                <DiscussionHeader />
                <DiscussionCommentsContainer>
                    {canComment ? <EnterProposalComment proposalIndex={proposalIndex} /> : null}
                    {proposalComments?.length ? proposalComments.map(renderProposalComment) : <NoComments />}
                </DiscussionCommentsContainer>
            </LoadingWrapper>
        </DiscussionContainer>
    )
}

export default PublicProposalDiscussion
