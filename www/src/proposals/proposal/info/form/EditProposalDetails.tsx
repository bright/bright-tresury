import React from 'react'
import { ProposalDto } from '../../../proposals.dto'
import { usePatchProposalDetails } from '../proposal-details.api'
import ProposalDetailsForm from './ProposalDetailsForm'

interface OwnProps {
    proposal: ProposalDto
}

export type EditProposalDetailsProps = OwnProps

const EditProposalDetails = ({ proposal: { details, proposalIndex } }: EditProposalDetailsProps) => {
    return (
        <>
            {details ? (
                <ProposalDetailsForm
                    useMutation={usePatchProposalDetails}
                    details={details}
                    proposalIndex={proposalIndex}
                />
            ) : null}
        </>
    )
}
export default EditProposalDetails
