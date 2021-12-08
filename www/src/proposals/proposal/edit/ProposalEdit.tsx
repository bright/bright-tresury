import React from 'react'
import { ProposalDto } from '../../proposals.dto'
import ProposalDetailsAdd from './ProposalDetailsAdd'
import ProposalDetailsEdit from './ProposalDetailsEdit'

interface OwnProps {
    proposal: ProposalDto
}

export type ProposalEditProps = OwnProps

const ProposalEdit = ({ proposal: { details, proposalIndex } }: ProposalEditProps) => {
    return (
        <>
            {details ? (
                <ProposalDetailsEdit details={details} proposalIndex={proposalIndex} />
            ) : (
                <ProposalDetailsAdd proposalIndex={proposalIndex} />
            )}
        </>
    )
}
export default ProposalEdit
