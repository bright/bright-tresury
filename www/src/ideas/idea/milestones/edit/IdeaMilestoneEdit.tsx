import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../../../components/button/Button'
import { MilestoneModalHeader } from '../../../../milestone-details/components/milestone-modal/MilestoneModalHeader'
import { IdeaDto } from '../../../ideas.dto'
import { IdeaMilestoneDto } from '../idea.milestones.dto'
import { useIdeaMilestone } from '../useIdeaMilestone'
import IdeaMilestoneEditForm from './IdeaMilestoneEditForm'

interface OwnProps {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
    onTurnIntoProposalClick: (ideaMilestone: IdeaMilestoneDto) => void
}

export type IdeaMilestoneEditProps = OwnProps

const IdeaMilestoneEdit = ({ idea, ideaMilestone, onClose, onTurnIntoProposalClick }: IdeaMilestoneEditProps) => {
    const { t } = useTranslation()

    const { canTurnIntoProposal } = useIdeaMilestone(ideaMilestone, idea)

    return (
        <>
            <MilestoneModalHeader>
                <h2 id="modal-title">{t('idea.milestones.modal.editMilestone')}</h2>
                {canTurnIntoProposal ? (
                    <Button color="primary" onClick={() => onTurnIntoProposalClick(ideaMilestone)}>
                        {t('idea.details.header.turnIntoProposal')}
                    </Button>
                ) : null}
            </MilestoneModalHeader>
            <IdeaMilestoneEditForm idea={idea} ideaMilestone={ideaMilestone} onCancel={onClose} onSuccess={onClose} />
        </>
    )
}

export default IdeaMilestoneEdit
