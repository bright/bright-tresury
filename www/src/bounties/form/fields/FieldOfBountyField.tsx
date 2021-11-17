import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledSmallFormSelect from '../../../components/select/StyledSmallFormSelect'

const FieldOfBountyField = () => {
    const { t } = useTranslation()
    return (
        <StyledSmallFormSelect
            name="field"
            label={t('bounty.form.fields.field')}
            placeholder={t('bounty.form.fields.field')}
            options={[
                t('bounty.form.fields.fieldOptions.optimisation'),
                t('bounty.form.fields.fieldOptions.treasury'),
                t('bounty.form.fields.fieldOptions.transactions'),
                t('bounty.form.fields.fieldOptions.other'),
            ]}
        />
    )
}
export default FieldOfBountyField
