import React from 'react'
import { useAuth } from '../../../auth/AuthContext'
import PrivateProposalDiscussion from './PrivateProposalDiscussion'
import PublicProposalDiscussion from './PublicProposalDiscussion'

interface OwnProps {
    proposalIndex: number
}
export type ProposalDiscussionProps = OwnProps
const ProposalDiscussion = ({ proposalIndex }: ProposalDiscussionProps) => {
    const { user, isUserSignedInAndVerified } = useAuth()

    return (
        <>
            {user && isUserSignedInAndVerified ? (
                <PrivateProposalDiscussion proposalIndex={proposalIndex} userId={user.id} />
            ) : (
                <PublicProposalDiscussion proposalIndex={proposalIndex} />
            )}
        </>
    )
}

export default ProposalDiscussion
