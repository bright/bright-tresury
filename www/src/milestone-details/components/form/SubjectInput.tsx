import React from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../components/form/input/Input'
import { TextFieldColorScheme } from '../../../components/form/input/textFieldStyles'

interface OwnProps {
    readonly: boolean
}

export type SubjectInputProps = OwnProps

const SubjectInput = ({ readonly }: SubjectInputProps) => {
    const { t } = useTranslation()

    return (
        <Input
            name="subject"
            label={t(`milestoneDetails.form.subject`)}
            placeholder={t(`milestoneDetails.form.yourMilestone`)}
            disabled={readonly}
            textFieldColorScheme={TextFieldColorScheme.Dark}
        />
    )
}

export default SubjectInput
