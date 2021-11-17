import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledInput from '../../../components/form/input/StyledInput'

const TitleField = () => {
    const { t } = useTranslation()
    return (
        <StyledInput name="title" placeholder={t('bounty.form.fields.title')} label={t('bounty.form.fields.title')} />
    )
}
export default TitleField
