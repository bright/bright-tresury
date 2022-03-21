import React, { useMemo } from 'react'
import { useAuth } from '../../../auth/AuthContext'
import { DiscussionCategory, ProposalDiscussionDto } from '../../../discussion/comments.dto'
import Discussion from '../../../discussion/Discussion'
import { useNetworks } from '../../../networks/useNetworks'
import { ProposalDto } from '../../proposals.dto'
import PrivateProposalDiscussion from './PrivateProposalDiscussion'

interface OwnProps {
    proposal: ProposalDto
}
export type ProposalDiscussionProps = OwnProps
const ProposalDiscussion = ({ proposal }: ProposalDiscussionProps) => {
    const { user, isUserSignedInAndVerified } = useAuth()
    const { network } = useNetworks()

    const discussion: ProposalDiscussionDto = useMemo(
        () => ({
            category: DiscussionCategory.Proposal,
            blockchainIndex: proposal.proposalIndex,
            networkId: network.id,
        }),
        [proposal.proposalIndex, network],
    )

    return (
        <>
            {user && isUserSignedInAndVerified ? (
                <PrivateProposalDiscussion discussion={discussion} userId={user.id} proposal={proposal} />
            ) : (
                <Discussion discussion={discussion} discussedEntity={proposal} />
            )}
        </>
    )
}

export default ProposalDiscussion
