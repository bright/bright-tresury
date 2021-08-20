import React from 'react'
import Modal from '../../../../components/modal/Modal'
import { IdeaDto } from '../../../ideas.dto'
import { IdeaMilestoneDetails } from '../details/IdeaMilestoneDetails'
import IdeaMilestoneEdit from '../edit/IdeaMilestoneEdit'
import { IdeaMilestoneDto } from '../idea.milestones.dto'
import { useIdeaMilestone } from '../useIdeaMilestone'

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
            {canEdit ? (
                <IdeaMilestoneEdit
                    idea={idea}
                    ideaMilestone={ideaMilestone}
                    onClose={onClose}
                    onTurnIntoProposalClick={onTurnIntoProposalClick}
                />
            ) : (
                <IdeaMilestoneDetails idea={idea} ideaMilestone={ideaMilestone} onClose={onClose} />
            )}
        </Modal>
    )
}

export default IdeaMilestoneModal
