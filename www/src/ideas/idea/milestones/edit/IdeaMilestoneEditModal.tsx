import React from 'react'
import { Modal } from '../../../../components/modal/Modal'
import { IdeaMilestoneEdit } from './IdeaMilestoneEdit'
import { IdeaMilestoneDto } from '../idea.milestones.api'
import { IdeaDto } from '../../../ideas.api'
import { useTranslation } from 'react-i18next'
import { IdeaMilestoneModalHeader } from '../components/IdeaMilestoneModalHeader'
import { useTurnIdeaMilestoneIntoProposal } from '../turnIntoProposal/useTurnIdeaMilestoneIntoProposal'
import { Button } from '../../../../components/button/Button'
import { useQueryClient } from 'react-query'

interface Props {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
    onTurnIntoProposalClick: (ideaMilestone: IdeaMilestoneDto) => void
}

export const IdeaMilestoneEditModal = ({ open, idea, ideaMilestone, onClose, onTurnIntoProposalClick }: Props) => {
    const { t } = useTranslation()

    const queryClient = useQueryClient()

    const { canTurnIntoProposal } = useTurnIdeaMilestoneIntoProposal(idea, ideaMilestone)

    const onSuccess = async () => {
        onClose()
        await queryClient.refetchQueries(['ideaMilestones', idea.id])
    }

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-title" fullWidth={true} maxWidth={'md'}>
            <>
                <IdeaMilestoneModalHeader>
                    <h2 id="modal-title">{t('idea.milestones.modal.editMilestone')}</h2>
                    {canTurnIntoProposal ? (
                        <Button color="primary" onClick={() => onTurnIntoProposalClick(ideaMilestone)}>
                            {t('idea.details.header.turnIntoProposal')}
                        </Button>
                    ) : null}
                </IdeaMilestoneModalHeader>
                <IdeaMilestoneEdit idea={idea} ideaMilestone={ideaMilestone} onCancel={onClose} onSuccess={onSuccess} />
            </>
        </Modal>
    )
}
