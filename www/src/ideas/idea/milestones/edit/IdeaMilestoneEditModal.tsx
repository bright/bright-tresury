import React from 'react'
import Modal from '../../../../components/modal/Modal'
import IdeaMilestoneEdit from './IdeaMilestoneEdit'
import { IdeaMilestoneDto } from '../idea.milestones.dto'
import { IdeaDto } from '../../../ideas.dto'
import { useTranslation } from 'react-i18next'
import { MilestoneModalHeader } from '../../../../milestone-details/components/milestone-modal/MilestoneModalHeader'
import { useTurnIdeaMilestoneIntoProposal } from '../turnIntoProposal/useTurnIdeaMilestoneIntoProposal'
import Button from '../../../../components/button/Button'

interface OwnProps {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
    onTurnIntoProposalClick: (ideaMilestone: IdeaMilestoneDto) => void
}

export type IdeaMilestoneEditModalProps = OwnProps

const IdeaMilestoneEditModal = ({
    open,
    idea,
    ideaMilestone,
    onClose,
    onTurnIntoProposalClick,
}: IdeaMilestoneEditModalProps) => {
    const { t } = useTranslation()

    const { canTurnIntoProposal } = useTurnIdeaMilestoneIntoProposal(idea, ideaMilestone)

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-title" fullWidth={true} maxWidth={'md'}>
            <>
                <MilestoneModalHeader>
                    <h2 id="modal-title">{t('idea.milestones.modal.editMilestone')}</h2>
                    {canTurnIntoProposal ? (
                        <Button color="primary" onClick={() => onTurnIntoProposalClick(ideaMilestone)}>
                            {t('idea.details.header.turnIntoProposal')}
                        </Button>
                    ) : null}
                </MilestoneModalHeader>
                <IdeaMilestoneEdit idea={idea} ideaMilestone={ideaMilestone} onCancel={onClose} onSuccess={onClose} />
            </>
        </Modal>
    )
}

export default IdeaMilestoneEditModal
