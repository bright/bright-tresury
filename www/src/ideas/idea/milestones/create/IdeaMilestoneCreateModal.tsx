import React from 'react'
import Modal from '../../../../components/modal/Modal'
import { IdeaMilestoneCreate } from './IdeaMilestoneCreate'
import { IdeaDto } from '../../../ideas.dto'
import { useTranslation } from 'react-i18next'
import { IdeaMilestoneModalHeader } from '../components/IdeaMilestoneModalHeader'

interface Props {
    open: boolean
    idea: IdeaDto
    onClose: () => void
}

export const IdeaMilestoneCreateModal = ({ open, idea, onClose }: Props) => {
    const { t } = useTranslation()

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-title" fullWidth={true} maxWidth={'md'}>
            <>
                <IdeaMilestoneModalHeader>
                    <h2 id="modal-title">{t('idea.milestones.modal.createMilestone')}</h2>
                </IdeaMilestoneModalHeader>
                <IdeaMilestoneCreate idea={idea} onCancel={onClose} onSuccess={onClose} />
            </>
        </Modal>
    )
}
