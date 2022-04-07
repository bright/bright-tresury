import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledInput from 'components/form/input/StyledInput'

const TitleField = () => {
    const { t } = useTranslation()
    return <StyledInput name="title" placeholder={t('tip.form.fields.title')} label={t('tip.form.fields.title')} />
}
export default TitleField
