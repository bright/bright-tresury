import React from 'react'
import { useAuth } from '../../../auth/AuthContext'
import DiscussionCommentsContainer from '../../../components/discussion/discussionCommentsContainer/DiscussionCommentsContainer'
import DiscussionContainer from '../../../components/discussion/discussionContainer/DiscussionContainer'
import DiscussionHeader from '../../../components/discussion/discussionHeader/DiscussionHeader'
import EnterBountyComment from './EnterBountyComment'

interface OwnProps {
    bountyIndex: number
}
export type PublicBountyDiscussionProps = OwnProps
const PublicBountyDiscussion = ({ bountyIndex }: PublicBountyDiscussionProps) => {
    // const { network } = useNetworks()
    // const { status, data: proposalComments } = useGetBountyComments(proposalIndex, network.id)
    const { isUserSignedInAndVerified: canComment } = useAuth()
    // const { t } = useTranslation()
    //
    // const renderBountyComment = (comment: CommentDto) => (
    //     <DisplayBountyComment key={comment.id} comment={comment} proposalIndex={proposalIndex} />
    // )

    return (
        <DiscussionContainer>
            {/*<LoadingWrapper*/}
            {/*    status={status}*/}
            {/*    errorText={t('errors.errorOccurredWhileLoadingBountyComments')}*/}
            {/*    loadingText={t('loading.proposalComments')}*/}
            {/*>*/}
            <DiscussionHeader />
            <DiscussionCommentsContainer>
                {canComment ? <EnterBountyComment bountyIndex={bountyIndex} /> : null}
                {/*{proposalComments?.length ? proposalComments.map(renderBountyComment) : <NoComments />}*/}
            </DiscussionCommentsContainer>
            {/*</LoadingWrapper>*/}
        </DiscussionContainer>
    )
}

export default PublicBountyDiscussion
