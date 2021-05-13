import React from 'react'
import { signUp } from '../../auth.api'
import EmailSignUpForm from './EmailSignUpForm'
import { useTranslation } from 'react-i18next'
import { AlreadySignedUp } from '../common/AlreadySignedUp'
import { SignOption } from '../../sign-components/SignOption'

const EmailSignUp: React.FC = () => {
    const { t } = useTranslation()

    return (
        <>
            <EmailSignUpForm submit={signUp} submitButtonLabel={t('auth.signUp.submitButton')} />
            <AlreadySignedUp signOption={SignOption.Email} />
        </>
    )
}

export default EmailSignUp
