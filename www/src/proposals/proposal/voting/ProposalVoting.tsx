import React from 'react'
import { ProposalDto } from '../../proposals.dto'
import Motions from '../../../components/voting/Motions'
import NoProposalMotion from './NoProposalMotion'

export interface ProposalVotingProps {
    proposal: ProposalDto
}

const ProposalVoting = ({ proposal }: ProposalVotingProps) => {
    return proposal.motions?.length ? (
        <Motions motions={proposal.motions} />
    ) : (
        <NoProposalMotion blockchainIndex={proposal.proposalIndex} />
    )
}

export default ProposalVoting
