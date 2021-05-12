import React from 'react'
import { signUp } from '../../auth.api'
import { AlreadySignedUp } from '../common/AlreadySignedUp'
import EmailSignUpForm from './EmailSignUpForm'
import { useTranslation } from 'react-i18next'

const EmailSignUp: React.FC = () => {
    const { t } = useTranslation()

    return (
        <>
            <EmailSignUpForm submit={signUp} submitButtonLabel={t('auth.signup.form.submitButton')} />
            <AlreadySignedUp />
        </>
    )
}

export default EmailSignUp
