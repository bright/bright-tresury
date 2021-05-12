import { Button, ButtonProps } from '../../../components/button/Button'
import { ButtonsContainer } from '../../../components/form/buttons/ButtonsContainer'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface OwnProps {
    label?: string
}

type Props = OwnProps & ButtonProps

export const SignUpButton = ({ label, ...props }: Props) => {
    const { t } = useTranslation()

    return (
        <ButtonsContainer>
            <Button {...props} variant="contained" color="primary" type="submit">
                {label || t('auth.signUp.submitButton')}
            </Button>
        </ButtonsContainer>
    )
}
