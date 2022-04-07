import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledSmallInput from '../../../components/form/input/StyledSmallInput'

const BeneficiaryField = () => {
    const { t } = useTranslation()
    return (
        <StyledSmallInput
            name="beneficiary"
            description={t('form.web3AddressInput.description')}
            placeholder={t('tip.form.fields.beneficiary')}
            label={t('tip.form.fields.beneficiary')}
            variant={'web3Address'}
        />
    )
}
export default BeneficiaryField
