import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../auth/AuthContext'
import { CommentDto } from '../../../components/discussion/comment.dto'
import DiscussionCommentsContainer from '../../../components/discussion/discussionCommentsContainer/DiscussionCommentsContainer'
import DiscussionContainer from '../../../components/discussion/discussionContainer/DiscussionContainer'
import DiscussionHeader from '../../../components/discussion/discussionHeader/DiscussionHeader'
import NoComments from '../../../components/discussion/noComments/NoComments'
import LoadingWrapper from '../../../components/loading/LoadingWrapper'
import { useNetworks } from '../../../networks/useNetworks'
import { useGetBountyComments } from './bounty.comments.api'
import DisplayBountyComment from './components/DisplayBountyComment'
import EnterBountyComment from './components/EnterBountyComment'

interface OwnProps {
    bountyIndex: number
}
export type PublicBountyDiscussionProps = OwnProps
const PublicBountyDiscussion = ({ bountyIndex }: PublicBountyDiscussionProps) => {
    const { network } = useNetworks()
    const { status, data: comments } = useGetBountyComments(bountyIndex, network.id)
    const { isUserSignedInAndVerified: canComment } = useAuth()
    const { t } = useTranslation()

    const renderBountyComment = (comment: CommentDto) => (
        <DisplayBountyComment key={comment.id} comment={comment} bountyIndex={bountyIndex} />
    )

    return (
        <DiscussionContainer>
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingBountyComments')}
                loadingText={t('loading.bountyComments')}
            >
                <DiscussionHeader />
                <DiscussionCommentsContainer>
                    {canComment ? <EnterBountyComment bountyIndex={bountyIndex} /> : null}
                    {comments?.length ? comments.map(renderBountyComment) : <NoComments />}
                </DiscussionCommentsContainer>
            </LoadingWrapper>
        </DiscussionContainer>
    )
}

export default PublicBountyDiscussion
