import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledSmallInput from '../../../components/form/input/StyledSmallInput'

const TitleField = () => {
    const { t } = useTranslation()
    return (
        <StyledSmallInput
            name="beneficiary"
            description={t('form.web3AddressInput.description')}
            placeholder={t('idea.details.beneficiary')}
            label={t('idea.details.beneficiary')}
            variant={'web3Address'}
        />
    )
}
export default TitleField
