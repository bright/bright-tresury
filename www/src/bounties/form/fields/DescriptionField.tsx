import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledInput from '../../../components/form/input/StyledInput'

const DescriptionField = () => {
    const { t } = useTranslation()
    return (
        <StyledInput
            name="description"
            multiline={true}
            rows={8}
            label={t('bounty.form.fields.description')}
            placeholder={t('bounty.form.fields.description')}
        />
    )
}
export default DescriptionField
