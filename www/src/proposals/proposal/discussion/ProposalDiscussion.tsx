import React, { useMemo } from 'react'
import { useAuth } from '../../../auth/AuthContext'
import { DiscussionCategory, ProposalDiscussionDto } from '../../../discussion/comments.dto'
import Discussion from '../../../discussion/Discussion'
import { useNetworks } from '../../../networks/useNetworks'
import PrivateProposalDiscussion from './PrivateProposalDiscussion'

interface OwnProps {
    proposalIndex: number
}
export type ProposalDiscussionProps = OwnProps
const ProposalDiscussion = ({ proposalIndex }: ProposalDiscussionProps) => {
    const { user, isUserSignedInAndVerified } = useAuth()
    const { network } = useNetworks()

    const discussion: ProposalDiscussionDto = useMemo(
        () => ({ category: DiscussionCategory.Proposal, blockchainIndex: proposalIndex, networkId: network.id }),
        [proposalIndex, network],
    )

    return (
        <>
            {user && isUserSignedInAndVerified ? (
                <PrivateProposalDiscussion discussion={discussion} userId={user.id} />
            ) : (
                <Discussion discussion={discussion} />
            )}
        </>
    )
}

export default ProposalDiscussion
