import React from 'react'
import { ProposalDto } from '../../proposals.dto'
import NoMotion from './NoMotion'
import Motions from './Motions'

export interface ProposalVotingProps {
    proposal: ProposalDto
}

const ProposalVoting = ({ proposal }: ProposalVotingProps) => {
    return proposal.motions?.length ? (
        <Motions motions={proposal.motions} />
    ) : (
        <NoMotion proposalIndex={proposal.proposalIndex} />
    )
}

export default ProposalVoting
