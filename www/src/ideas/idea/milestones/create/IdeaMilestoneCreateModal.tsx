import React from 'react'
import Modal from '../../../../components/modal/Modal'
import IdeaMilestoneCreate from './IdeaMilestoneCreate'
import { IdeaDto } from '../../../ideas.dto'
import { useTranslation } from 'react-i18next'
import { MilestoneModalHeader } from '../../../../milestone-details/components/milestone-modal/MilestoneModalHeader'

interface OwnProps {
    open: boolean
    idea: IdeaDto
    onClose: () => void
}

export type IdeaMilestoneCreateModalProps = OwnProps

const IdeaMilestoneCreateModal = ({ open, idea, onClose }: IdeaMilestoneCreateModalProps) => {
    const { t } = useTranslation()

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-title" fullWidth={true} maxWidth={'md'}>
            <>
                <MilestoneModalHeader>
                    <h2 id="modal-title">{t('idea.milestones.modal.createMilestone')}</h2>
                </MilestoneModalHeader>
                <IdeaMilestoneCreate idea={idea} onCancel={onClose} onSuccess={onClose} />
            </>
        </Modal>
    )
}

export default IdeaMilestoneCreateModal
