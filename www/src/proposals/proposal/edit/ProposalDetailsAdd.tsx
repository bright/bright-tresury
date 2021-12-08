import React from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../../components/form/Container'
import { usePostProposalDetails } from '../info/proposal-details.api'
import ProposalDetailsForm from './ProposalDetailsForm'

const INITIAL_DETAILS = { title: '', field: '', content: '', contact: '', portfolio: '', links: [] }

interface OwnProps {
    proposalIndex: number
}

export type ProposalDetailsAddProps = OwnProps

const ProposalDetailsAdd = ({ proposalIndex }: ProposalDetailsAddProps) => {
    const { t } = useTranslation()

    return (
        <Container title={t('proposal.details.add')}>
            <ProposalDetailsForm
                useMutation={usePostProposalDetails}
                details={INITIAL_DETAILS}
                proposalIndex={proposalIndex}
            />
        </Container>
    )
}
export default ProposalDetailsAdd
