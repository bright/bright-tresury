import { DialogProps as MaterialDialogProps } from '@material-ui/core/Dialog/Dialog'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import QuestionModal from '../../../../components/modal/warning-modal/QuestionModal'
import QuestionModalButtons from '../../../../components/modal/warning-modal/QuestionModalButtons'
import QuestionModalError from '../../../../components/modal/warning-modal/QuestionModalError'
import QuestionModalSubtitle from '../../../../components/modal/warning-modal/QuestionModalSubtitle'
import QuestionModalTitle from '../../../../components/modal/warning-modal/QuestionModalTitle'
import { IdeaDto } from '../../../ideas.dto'
import { IDEA_MILESTONES_QUERY_KEY_BASE, useDeleteIdeaMilestone } from '../idea.milestones.api'
import { IdeaMilestoneDto } from '../idea.milestones.dto'

interface OwnProps {
    idea: IdeaDto
    ideaMilestone: IdeaMilestoneDto
    onClose: () => void
    onIdeaMilestoneModalClose: () => void
}

export type DeleteIdeaMilestoneModalProps = OwnProps & MaterialDialogProps

const DeleteIdeaMilestoneModal = ({
    open,
    onClose,
    idea,
    ideaMilestone,
    onIdeaMilestoneModalClose,
}: DeleteIdeaMilestoneModalProps) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    const { mutateAsync: deleteIdeaMilestone, isError } = useDeleteIdeaMilestone()
    const handleDeleteMilestone = async () => {
        await deleteIdeaMilestone(
            { ideaMilestoneId: ideaMilestone.id, ideaId: idea.id },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([IDEA_MILESTONES_QUERY_KEY_BASE, idea.id])
                    onIdeaMilestoneModalClose()
                },
            },
        )
    }

    return (
        <QuestionModal onClose={onClose} open={open}>
            <QuestionModalTitle title={t('idea.milestones.modal.form.removeModal.title')} />
            <QuestionModalSubtitle subtitle={t('idea.milestones.modal.form.removeModal.subtitle')} />
            <QuestionModalButtons
                onClose={onClose}
                discardLabel={t('idea.milestones.modal.form.removeModal.discard')}
                onSubmit={handleDeleteMilestone}
                submitLabel={t('idea.milestones.modal.form.removeModal.removeMilestone')}
            />
            <QuestionModalError isError={isError} error={t('idea.milestones.modal.form.removeModal.error')} />
        </QuestionModal>
    )
}

export default DeleteIdeaMilestoneModal
