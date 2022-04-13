import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledSmallInput from '../../../components/form/input/StyledSmallInput'

const BlockchainReasonField = () => {
    const { t } = useTranslation()
    return (
        <StyledSmallInput
            name="blockchainReason"
            placeholder={t('tip.form.fields.blockchainReason')}
            label={t('tip.form.fields.blockchainReason')}
        />
    )
}
export default BlockchainReasonField
