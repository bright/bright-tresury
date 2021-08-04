import React from 'react'
import { useTranslation } from 'react-i18next'
import { MilestoneModalHeader } from '../../../../milestone-details/components/milestone-modal/MilestoneModalHeader'
import ProposalMilestoneForm from '../form/ProposalMilestoneForm'
import { ProposalMilestoneDto } from '../proposal.milestones.dto'

interface OwnProps {
    milestone: ProposalMilestoneDto
    onCancel: () => void
    canEdit: boolean
}

export type IdeaMilestoneDetailsProps = OwnProps

const ProposalMilestoneDetails = ({ milestone, onCancel, canEdit }: IdeaMilestoneDetailsProps) => {
    const { t } = useTranslation()

    return (
        <div>
            <MilestoneModalHeader>
                <h2 id="modal-title">
                    {t('idea.milestones.modal.milestone')} - <b>{milestone.ordinalNumber}</b>
                </h2>
            </MilestoneModalHeader>
            {/*TODO set readonly to !canEdit when milestones editing available*/}
            <ProposalMilestoneForm milestone={milestone} readonly={true} onCancel={onCancel} />
        </div>
    )
}

export default ProposalMilestoneDetails
