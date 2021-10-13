import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { MilestoneModalHeader } from '../../../../milestone-details/components/milestone-modal/MilestoneModalHeader'
import { useNetworks } from '../../../../networks/useNetworks'
import ProposalMilestoneForm, { ProposalMilestoneFormValues } from '../form/ProposalMilestoneForm'
import { PROPOSAL_MILESTONES_QUERY_KEY_BASE, useCreateProposalMilestone } from '../proposal.milestones.api'
import { CreateProposalMilestoneDto } from '../proposal.milestones.dto'

interface OwnProps {
    proposalIndex: number
    onClose: () => void
}

export type ProposalMilestoneCreateProps = OwnProps

const ProposalMilestoneCreate = ({ onClose, proposalIndex }: ProposalMilestoneCreateProps) => {
    const { t } = useTranslation()

    const { network } = useNetworks()
    const { mutateAsync, isError, isLoading } = useCreateProposalMilestone()

    const queryClient = useQueryClient()

    const onSubmit = async (values: ProposalMilestoneFormValues) => {
        const data: CreateProposalMilestoneDto = {
            details: values,
        }

        await mutateAsync(
            { proposalIndex, network: network.id, data },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([PROPOSAL_MILESTONES_QUERY_KEY_BASE, proposalIndex, network.id])
                    onClose()
                },
            },
        )
    }

    return (
        <div>
            <MilestoneModalHeader>
                <h2 id="modal-title">{t('proposal.milestones.modal.createMilestone')}</h2>
            </MilestoneModalHeader>
            <ProposalMilestoneForm
                proposalIndex={proposalIndex}
                readonly={false}
                onCancel={onClose}
                onSubmit={onSubmit}
                isError={isError}
                isLoading={isLoading}
            />
        </div>
    )
}

export default ProposalMilestoneCreate
