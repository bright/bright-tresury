import React from 'react'
import { ProposalDto } from '../../../proposals.dto'
import ProposalEditForm from './ProposalEditForm'

interface OwnProps {
    proposal: ProposalDto
}

export type ProposalEditProps = OwnProps

const ProposalEdit = ({ proposal }: ProposalEditProps) => {
    return (
        <>
            {proposal.details ? (
                <ProposalEditForm details={proposal.details} proposalIndex={proposal.proposalIndex} />
            ) : (
                //TODO show button to add details - TREAS-198
                'Shall add?'
            )}
        </>
    )
}
export default ProposalEdit
