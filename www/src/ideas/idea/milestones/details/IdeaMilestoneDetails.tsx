import React from 'react'
import { useTranslation } from 'react-i18next'
import { MilestoneModalHeader } from '../../../../milestone-details/components/milestone-modal/MilestoneModalHeader'
import { IdeaDto } from '../../../ideas.dto'
import { IdeaMilestoneDto } from '../idea.milestones.dto'
import IdeaMilestoneDetailsForm from './IdeaMilestoneDetailsForm'

interface Props {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
}

export const IdeaMilestoneDetails = ({ idea, ideaMilestone, onClose }: Props) => {
    const { t } = useTranslation()

    return (
        <>
            <MilestoneModalHeader>
                <h2 id="modal-title">
                    {t('idea.milestones.modal.milestone')} - <b>{ideaMilestone.ordinalNumber}</b>
                </h2>
            </MilestoneModalHeader>
            <IdeaMilestoneDetailsForm idea={idea} ideaMilestone={ideaMilestone} onCancel={onClose} />
        </>
    )
}
