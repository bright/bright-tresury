import { DialogProps as MaterialDialogProps } from '@material-ui/core/Dialog/Dialog'
import React from 'react'
import { useTranslation } from 'react-i18next'
import QuestionModal from '../modal/warning-modal/QuestionModal'
import QuestionModalButtons from '../modal/warning-modal/QuestionModalButtons'
import QuestionModalSubtitle from '../modal/warning-modal/QuestionModalSubtitle'
import QuestionModalTitle from '../modal/warning-modal/QuestionModalTitle'

interface OwnProps {
    onClose: () => void
    handleFormClose: () => void
}

export type CloseFormWarningModalProps = OwnProps & MaterialDialogProps

const CloseFormWarningModal = ({ open, onClose, handleFormClose }: CloseFormWarningModalProps) => {
    const { t } = useTranslation()

    return (
        <QuestionModal onClose={onClose} open={open}>
            <QuestionModalTitle title={t('components.warningModal.title')} />
            <QuestionModalSubtitle subtitle={t('components.warningModal.subtitle')} />
            <QuestionModalButtons
                onClose={onClose}
                onSubmit={handleFormClose}
                submitLabel={t('components.warningModal.close')}
                discardLabel={t('components.warningModal.discard')}
            />
        </QuestionModal>
    )
}

export default CloseFormWarningModal
