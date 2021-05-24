import React from 'react'
import {useTranslation} from 'react-i18next'
import {SendVerifyEmailAPIResponse} from "supertokens-auth-react/lib/build/recipe/emailverification/types";
import {useAccounts} from "../../../substrate-lib/hooks/useAccounts";
import {useAuth} from "../../AuthContext";
import EmailSignUpForm, {SignUpValues} from '../../sign-up/email/EmailSignUpForm'
import {associateEmailPassword} from './email-password.api'

const EmailPasswordAccountForm = () => {
    const {t} = useTranslation()
    const {user} = useAuth()
    const accounts = useAccounts()

    const submit = (data: SignUpValues) => {
        const address = user?.web3Addresses.find((address) => address.isPrimary)
        if (!address) {
            console.log('dhfjdg')
            throw Error()
        }
        const account = accounts.find((account) => account.address === address.address)
        if (!account) {
            console.log('dhfjdg')
            throw Error()
        }
        return associateEmailPassword(account, {...data}) as Promise<SendVerifyEmailAPIResponse>
    }

    return (
        <EmailSignUpForm
            variant={'left'}
            submit={submit}
            submitButtonLabel={t('account.emailPassword.addEmailCredentials')}
        />
    )
}

export default EmailPasswordAccountForm
