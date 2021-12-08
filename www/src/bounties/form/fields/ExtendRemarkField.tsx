import React from 'react'
import { useTranslation } from 'react-i18next'
import StyledInput from '../../../components/form/input/StyledInput'

const ExtendRemarkField = () => {
    const { t } = useTranslation()
    return (
        <StyledInput
            name="remark"
            placeholder={t('bounty.form.fields.extendRemark')}
            label={t('bounty.form.fields.extendRemark')}
            description={t('bounty.form.fields.extendRemarkDescription')}
        />
    )
}
export default ExtendRemarkField
