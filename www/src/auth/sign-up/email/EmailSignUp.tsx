import React from 'react'
import {useAuth} from "../../AuthContext";
import EmailSignUpForm from './EmailSignUpForm'
import { useTranslation } from 'react-i18next'
import { AlreadySignedUp } from '../common/AlreadySignedUp'
import { SignOption } from '../../sign-components/SignOption'

const EmailSignUp: React.FC = () => {
    const { t } = useTranslation()
    const {emailPasswordSignUp} = useAuth()

    return (
        <>
            <EmailSignUpForm submit={emailPasswordSignUp} submitButtonLabel={t('auth.signUp.submitButton')} />
            <AlreadySignedUp signOption={SignOption.Email} />
        </>
    )
}

export default EmailSignUp
