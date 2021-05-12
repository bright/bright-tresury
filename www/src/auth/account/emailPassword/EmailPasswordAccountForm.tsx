import React from 'react'
import { useTranslation } from 'react-i18next'
import EmailSignUpForm from '../../sign-up/email/EmailSignUpForm'
import { addEmailPassword } from '../account.api'

const EmailPasswordAccountForm = () => {
    const { t } = useTranslation()

    return (
        <div>
            <EmailSignUpForm
                submit={addEmailPassword}
                submitButtonLabel={t('account.emailPassword.addEmailCredentials')}
            />
        </div>
    )
}

export default EmailPasswordAccountForm
