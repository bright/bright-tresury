import React from 'react'
import Modal from '../../../../components/modal/Modal'
import { IdeaDto } from '../../../ideas.dto'
import { IdeaMilestoneDto } from '../idea.milestones.dto'
import { useIdeaMilestone } from '../useIdeaMilestone'
import IdeaMilestoneEditForm from '../edit/IdeaMilestoneEditForm'
import IdeaMilestoneDetailsForm from '../details/IdeaMilestoneDetailsForm'
import { IdeaMilestoneContainer } from '../components/IdeaMilestoneContainer'

interface OwnProps {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
    onTurnIntoProposalClick: (ideaMilestone: IdeaMilestoneDto) => void
}

export type IdeaMilestoneModalProps = OwnProps

const IdeaMilestoneModal = ({
    open,
    idea,
    ideaMilestone,
    onClose,
    onTurnIntoProposalClick,
}: IdeaMilestoneModalProps) => {
    const { canEdit } = useIdeaMilestone(ideaMilestone, idea)
    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-title" fullWidth={true} maxWidth={'md'}>
            <IdeaMilestoneContainer
                idea={idea}
                ideaMilestone={ideaMilestone}
                onTurnIntoProposalClick={onTurnIntoProposalClick}
            >
                {canEdit ? (
                    <IdeaMilestoneEditForm idea={idea} ideaMilestone={ideaMilestone} onClose={onClose} />
                ) : (
                    <IdeaMilestoneDetailsForm idea={idea} ideaMilestone={ideaMilestone} onClose={onClose} />
                )}
            </IdeaMilestoneContainer>
        </Modal>
    )
}

export default IdeaMilestoneModal
