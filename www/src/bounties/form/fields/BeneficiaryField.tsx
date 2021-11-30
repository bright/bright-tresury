import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledSmallInput from '../../../components/form/input/StyledSmallInput'

const TitleField = () => {
    const { t } = useTranslation()
    return (
        <StyledSmallInput
            name="beneficiary"
            placeholder={t('bounty.form.fields.beneficiary')}
            label={t('bounty.form.fields.beneficiary')}
        />
    )
}
export default TitleField
