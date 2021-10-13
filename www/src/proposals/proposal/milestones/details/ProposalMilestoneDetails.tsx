import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { MilestoneModalHeader } from '../../../../milestone-details/components/milestone-modal/MilestoneModalHeader'
import { useNetworks } from '../../../../networks/useNetworks'
import ProposalMilestoneForm, { ProposalMilestoneFormValues } from '../form/ProposalMilestoneForm'
import { PROPOSAL_MILESTONES_QUERY_KEY_BASE, usePatchProposalMilestone } from '../proposal.milestones.api'
import { ProposalMilestoneDto, UpdateProposalMilestoneDto } from '../proposal.milestones.dto'

interface OwnProps {
    proposalIndex: number
    milestone: ProposalMilestoneDto
    ordinalNumber: number
    onClose: () => void
    canEdit: boolean
}

export type ProposalMilestoneDetailsProps = OwnProps

const ProposalMilestoneDetails = ({
    milestone,
    onClose,
    canEdit,
    proposalIndex,
    ordinalNumber,
}: ProposalMilestoneDetailsProps) => {
    const { t } = useTranslation()

    const { network } = useNetworks()
    const { mutateAsync, isError, isLoading } = usePatchProposalMilestone()

    const queryClient = useQueryClient()

    const onSubmit = async (values: ProposalMilestoneFormValues) => {
        const data: UpdateProposalMilestoneDto = {
            details: values,
        }

        await mutateAsync(
            { proposalIndex, network: network.id, milestoneId: milestone.id, data },
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
                <h2 id="modal-title">
                    {t('proposal.milestones.modal.milestone')} - <b>{ordinalNumber}</b>
                </h2>
            </MilestoneModalHeader>
            <ProposalMilestoneForm
                proposalIndex={proposalIndex}
                milestone={milestone}
                readonly={!canEdit}
                onSubmit={onSubmit}
                onCancel={onClose}
                isLoading={isLoading}
                isError={isError}
            />
        </div>
    )
}

export default ProposalMilestoneDetails
