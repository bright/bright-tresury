import React from 'react'
import PolkassemblyShareButton from '../../../polkassembly/PolkassemblyShareButton'
import { ProposalDto } from '../../proposals.dto'
import { useProposalPolkassemblyShare } from './useProposalPolkassemblyShare'

interface OwnProps {
    proposal: ProposalDto
}

export type ProposalPolkassemblyShareButtonProps = OwnProps

const ProposalPolkassemblyShareButton = ({
    proposal: { proposalIndex, proposer, details },
}: ProposalPolkassemblyShareButtonProps) => {
    const { postData } = useProposalPolkassemblyShare({ proposalIndex, details })

    return <PolkassemblyShareButton web3address={proposer.address} postData={postData} disabled={!details} />
}

export default ProposalPolkassemblyShareButton
