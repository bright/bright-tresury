import React from 'react'
import { useTranslation } from 'react-i18next'
import { InputProps } from '../../components/form/input/Input'
import StyledInput from '../../components/form/input/StyledInput'

interface OwnProps {}

export type ContactInputProps = OwnProps & Partial<InputProps>

const ContactInput = (props: ContactInputProps) => {
    const { t } = useTranslation()

    return (
        <StyledInput
            name="contact"
            multiline={true}
            rows={20}
            label={t('ideaProposalDetails.contact')}
            placeholder={t('ideaProposalDetails.contact')}
            {...props}
        />
    )
}

export default ContactInput
