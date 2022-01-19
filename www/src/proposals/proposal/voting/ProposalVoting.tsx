import React from 'react'
import { ProposalDto } from '../../proposals.dto'
import Motions from '../../../components/voting/Motions'
import NoProposalMotion from './NoProposalMotion'
import { useGetMotions } from '../../proposals.api'
import { useNetworks } from '../../../networks/useNetworks'

export interface ProposalVotingProps {
    proposal: ProposalDto
}

const ProposalVoting = ({ proposal }: ProposalVotingProps) => {
    const { network } = useNetworks()
    const { data: polkassemblyMotions } = useGetMotions({
        proposalIndex: proposal.proposalIndex,
        network: network.id,
    })

    const motions = [...(proposal.motions ?? []), ...(polkassemblyMotions ?? [])]

    return motions.length ? (
        <Motions motions={motions} />
    ) : (
        <NoProposalMotion blockchainIndex={proposal.proposalIndex} />
    )
}

export default ProposalVoting
