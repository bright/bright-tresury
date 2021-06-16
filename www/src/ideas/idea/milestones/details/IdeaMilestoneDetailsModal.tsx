import React from 'react'
import Modal from '../../../../components/modal/Modal'
import IdeaMilestoneDetails from './IdeaMilestoneDetails'
import { IdeaMilestoneDto } from '../idea.milestones.dto'
import { IdeaDto } from '../../../ideas.dto'
import { useTranslation } from 'react-i18next'
import { IdeaMilestoneModalHeader } from '../components/IdeaMilestoneModalHeader'

interface Props {
    open: boolean
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
}

export const IdeaMilestoneDetailsModal = ({ open, idea, ideaMilestone, onClose }: Props) => {
    const { t } = useTranslation()

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-title" fullWidth={true} maxWidth={'md'}>
            <>
                <IdeaMilestoneModalHeader>
                    <h2 id="modal-title">
                        {t('idea.milestones.modal.milestone')} - <b>{ideaMilestone.ordinalNumber}</b>
                    </h2>
                </IdeaMilestoneModalHeader>
                <IdeaMilestoneDetails idea={idea} ideaMilestone={ideaMilestone} onCancel={onClose} />
            </>
        </Modal>
    )
}
