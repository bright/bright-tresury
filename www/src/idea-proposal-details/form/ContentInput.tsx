import React from 'react'
import { useTranslation } from 'react-i18next'
import { InputProps } from '../../components/form/input/Input'
import StyledInput from '../../components/form/input/StyledInput'

interface OwnProps {}

export type ContentInputProps = OwnProps & Partial<InputProps>

const ContentInput = (props: ContentInputProps) => {
    const { t } = useTranslation()

    return (
        <StyledInput
            name="content"
            multiline={true}
            rows={20}
            label={t('ideaProposalDetails.content')}
            placeholder={t('ideaProposalDetails.content')}
            variant={'markdown'}
            {...props}
        />
    )
}

export default ContentInput
