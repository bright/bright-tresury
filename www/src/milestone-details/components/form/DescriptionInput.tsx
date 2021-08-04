import React from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../components/form/input/Input'
import { TextFieldColorScheme } from '../../../components/form/input/textFieldStyles'

interface OwnProps {
    readonly: boolean
}

export type DescriptionInputProps = OwnProps

const DescriptionInput = ({ readonly }: DescriptionInputProps) => {
    const { t } = useTranslation()

    return (
        <Input
            name="description"
            label={t(`milestoneDetails.form.description`)}
            placeholder={t(`milestoneDetails.form.describeMilestone`)}
            disabled={readonly}
            rows={4}
            multiline={true}
            textFieldColorScheme={TextFieldColorScheme.Dark}
        />
    )
}

export default DescriptionInput
