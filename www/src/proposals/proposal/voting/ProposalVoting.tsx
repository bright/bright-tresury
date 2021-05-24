import React from 'react'
import { useProposalStyles } from '../Proposal'

const ProposalVoting: React.FC = () => {
    const proposalClasses = useProposalStyles()

    return <div className={proposalClasses.content}>Voting</div>
}

export default ProposalVoting
