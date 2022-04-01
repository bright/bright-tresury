import { useMediaQuery, useTheme } from '@material-ui/core'
import { DialogProps as MaterialDialogProps } from '@material-ui/core/Dialog/Dialog'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { breakpoints } from '../../theme/theme'
import { Nil } from '../../util/types'
import QuestionModal from '../modal/warning-modal/QuestionModal'
import QuestionModalButtons from '../modal/warning-modal/QuestionModalButtons'
import QuestionModalSubtitle from '../modal/warning-modal/QuestionModalSubtitle'
import QuestionModalTitle from '../modal/warning-modal/QuestionModalTitle'
import User from '../user/User'

interface OwnProps {
    onClose: () => void
    onSubmit: () => void
    beneficiary: Nil<string>
}

export type ConfirmBeneficiaryWarningModalProps = OwnProps & MaterialDialogProps

const ConfirmBeneficiaryWarningModal = ({
    open,
    onClose,
    onSubmit,
    beneficiary,
}: ConfirmBeneficiaryWarningModalProps) => {
    const { t } = useTranslation()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down(breakpoints.mobile))

    return (
        <QuestionModal onClose={onClose} open={open} maxWidth={'md'}>
            <QuestionModalTitle title={t('form.web3AddressInput.warningModal.title')} />
            <QuestionModalSubtitle subtitle={t('form.web3AddressInput.warningModal.subtitle')} />
            <User user={{ web3address: beneficiary }} ellipsis={isMobile} />
            <QuestionModalButtons
                onClose={onClose}
                onSubmit={onSubmit}
                submitLabel={t('form.web3AddressInput.warningModal.close')}
                discardLabel={t('form.web3AddressInput.warningModal.discard')}
            />
        </QuestionModal>
    )
}

export default ConfirmBeneficiaryWarningModal
