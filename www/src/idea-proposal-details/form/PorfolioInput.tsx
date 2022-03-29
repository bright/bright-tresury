import React from 'react'
import { useTranslation } from 'react-i18next'
import { InputProps } from '../../components/form/input/Input'
import StyledInput from '../../components/form/input/StyledInput'

interface OwnProps {}

export type PortfolioInputProps = OwnProps & Partial<InputProps>

const PortfolioInput = (props: PortfolioInputProps) => {
    const { t } = useTranslation()

    return (
        <StyledInput
            name="portfolio"
            multiline={true}
            rows={20}
            label={t('ideaProposalDetails.portfolio')}
            placeholder={t('ideaProposalDetails.portfolio')}
            variant={'markdown'}
            {...props}
        />
    )
}

export default PortfolioInput
