import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledSmallInput from '../../../components/form/input/StyledSmallInput'

const BlockchainDescriptionField = () => {
    const { t } = useTranslation()
    return (
        <StyledSmallInput
            name="blockchainDescription"
            placeholder={t('tip.form.fields.blockchainDescription')}
            label={t('tip.form.fields.blockchainDescription')}
        />
    )
}
export default BlockchainDescriptionField
