import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledInput from 'components/form/input/StyledInput'

const DescriptionField = () => {
    const { t } = useTranslation()
    return (
        <StyledInput
            name="description"
            multiline={true}
            rows={20}
            label={t('tip.form.fields.description')}
            placeholder={t('tip.form.fields.description')}
            variant={'markdown'}
        />
    )
}
export default DescriptionField
