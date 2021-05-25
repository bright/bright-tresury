import React from 'react'
import {useTranslation} from 'react-i18next'
import {useAccounts} from "../../../substrate-lib/hooks/useAccounts";
import {useAuth} from "../../AuthContext";
import EmailSignUpForm, {SignUpValues} from '../../sign-up/email/EmailSignUpForm'

const EmailPasswordAccountForm = () => {
    const {t} = useTranslation()
    const {user, emailPasswordAssociate} = useAuth()
    const accounts = useAccounts()

    const submit = (data: SignUpValues) => {
        const address = user?.web3Addresses.find((address) => address.isPrimary)
        if (!address) {
            return Promise.reject(Error(t('account.emailPassword.addressNotFound')))
        }
        const account = accounts.find((account) => account.address === address.address)
        if (!account) {
            return Promise.reject(Error(t('account.emailPassword.accountNotFound')))
        }
        return emailPasswordAssociate(account, {...data})
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
