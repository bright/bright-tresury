import React from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../../components/form/Container'
import { IdeaProposalDetailsDto } from '../../../idea-proposal-details/idea-proposal-details.dto'
import { usePatchProposalDetails } from '../info/proposal-details.api'
import ProposalDetailsForm from './ProposalDetailsForm'

interface OwnProps {
    details: IdeaProposalDetailsDto
    proposalIndex: number
}

export type ProposalDetailsEditProps = OwnProps

const ProposalDetailsEdit = ({ details, proposalIndex }: ProposalDetailsEditProps) => {
    const { t } = useTranslation()

    return (
        <Container title={t('proposal.details.edit')}>
            <ProposalDetailsForm
                useMutation={usePatchProposalDetails}
                details={details}
                proposalIndex={proposalIndex}
            />
        </Container>
    )
}
export default ProposalDetailsEdit
