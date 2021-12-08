import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledSmallInput from '../../../components/form/input/StyledSmallInput'

const TitleField = () => {
    const { t } = useTranslation()
    return (
        <StyledSmallInput
            name="beneficiary"
            description={t('form.web3AddressInput.description')}
            placeholder={t('bounty.form.fields.beneficiary')}
            label={t('bounty.form.fields.beneficiary')}
        />
    )
}
export default TitleField
