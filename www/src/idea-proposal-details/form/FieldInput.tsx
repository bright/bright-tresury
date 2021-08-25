import React from 'react'
import { useTranslation } from 'react-i18next'
import { FormSelectProps } from '../../components/select/FormSelect'
import StyledSmallFormSelect from '../../components/select/StyledSmallFormSelect'

interface OwnProps {}

export type FieldInputProps = OwnProps & Partial<FormSelectProps>

const FieldInput = (props: FieldInputProps) => {
    const { t } = useTranslation()

    return (
        <StyledSmallFormSelect
            name="field"
            label={t('ideaProposalDetails.field')}
            placeholder={t('ideaProposalDetails.field')}
            options={[
                t('ideaProposalDetails.fieldOptions.optimisation'),
                t('ideaProposalDetails.fieldOptions.treasury'),
                t('ideaProposalDetails.fieldOptions.transactions'),
                t('ideaProposalDetails.fieldOptions.other'),
            ]}
            {...props}
        />
    )
}

export default FieldInput
