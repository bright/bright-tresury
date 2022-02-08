import { DialogProps as MaterialDialogProps } from '@material-ui/core/Dialog/Dialog'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import QuestionModal from '../../components/modal/warning-modal/QuestionModal'
import QuestionModalButtons from '../../components/modal/warning-modal/QuestionModalButtons'
import QuestionModalError from '../../components/modal/warning-modal/QuestionModalError'
import QuestionModalSubtitle from '../../components/modal/warning-modal/QuestionModalSubtitle'
import QuestionModalTitle from '../../components/modal/warning-modal/QuestionModalTitle'
import { useNetworks } from '../../networks/useNetworks'
import { IDEAS_QUERY_KEY_BASE, useDeleteIdea } from '../ideas.api'
import { IdeaDto } from '../ideas.dto'

interface OwnProps {
    idea: IdeaDto
    onClose: () => void
}

export type DeleteIdeaModalProps = OwnProps & MaterialDialogProps

const DeleteIdeaModal = ({ open, onClose, idea }: DeleteIdeaModalProps) => {
    const { t } = useTranslation()
    const history = useHistory()
    const { network } = useNetworks()

    const { mutateAsync: deleteIdea, isError } = useDeleteIdea()
    const queryClient = useQueryClient()

    const ideaId = idea.id

    const handleDelete = async () => {
        await deleteIdea(
            { ideaId },
            {
                onSuccess: async () => {
                    await queryClient.refetchQueries([IDEAS_QUERY_KEY_BASE, network.id])
                    history.goBack()
                },
            },
        )
    }

    return (
        <QuestionModal onClose={onClose} open={open}>
            <QuestionModalTitle title={t('idea.optionsMenu.deleteIdeaModal.title')} />
            <QuestionModalSubtitle subtitle={t('idea.optionsMenu.deleteIdeaModal.subtitle')} />
            <QuestionModalButtons
                onClose={onClose}
                discardLabel={t('idea.optionsMenu.discard')}
                onSubmit={handleDelete}
                submitLabel={t('idea.optionsMenu.deleteIdea')}
            />
            <QuestionModalError isError={isError} error={t('idea.optionsMenu.deleteIdeaModal.error')} />
        </QuestionModal>
    )
}

export default DeleteIdeaModal
