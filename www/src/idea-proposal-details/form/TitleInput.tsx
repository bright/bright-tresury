import React from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { InputProps } from '../../components/form/input/Input'
import StyledInput from '../../components/form/input/StyledInput'

export const titleValidationSchema = (t: (key: string) => string) =>
    Yup.string().required(t('ideaProposalDetails.form.emptyFieldError'))

interface OwnProps {}

export type TitleInputProps = OwnProps & Partial<InputProps>

const TitleInput = (props: TitleInputProps) => {
    const { t } = useTranslation()

    return (
        <StyledInput
            name="title"
            placeholder={t('ideaProposalDetails.title')}
            label={t('ideaProposalDetails.title')}
            {...props}
        />
    )
}

export default TitleInput
