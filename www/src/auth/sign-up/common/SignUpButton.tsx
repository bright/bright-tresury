import { Button, ButtonProps } from '../../../components/button/Button'
import { FormFooterButtonsContainer } from '../../../components/form/footer/FormFooterButtonsContainer'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface OwnProps {
    label?: string
}

type Props = OwnProps & ButtonProps

export const SignUpButton = ({ label, ...props }: Props) => {
    const { t } = useTranslation()

    return (
        <FormFooterButtonsContainer>
            <Button {...props} variant="contained" color="primary" type="submit">
                {label || t('auth.signUp.submitButton')}
            </Button>
        </FormFooterButtonsContainer>
    )
}
